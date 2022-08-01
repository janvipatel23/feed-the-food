import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import { Button } from "@mui/material";
import { Grid } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import DoneIcon from "@mui/icons-material/Done";
import "react-toastify/dist/ReactToastify.css";
import {
  getCharacters,
  addOrUpdateCharacter,
  getIfRegistered,
} from "../../cloud/dynamo";
import { invokeLambda } from "../../cloud/lambda";
import { invokeses } from "../../cloud/ses";

function Admin() {
  const [ngoList, setNgoList] = useState([]);
  const [selectedBtnId, setSelectedBtnId] = useState(-1);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getCharacters();
        setNgoList(result.Items);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  function alert() {
    toast.error("Unable to Verify", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  function handleClick(ngo, updateKey) {
    setSelectedBtnId(ngo.documentKey.toString());
    // lambda function
    async function callingLambda() {
      const document = ngo.documentKey;
      const result = await invokeLambda(document);
      const n = result.replace(" ", "");
      const registrationNumberList = await getIfRegistered(n);

      const element = registrationNumberList.filter((number) => {
        return number.regNo.toString() === n;
      });

      if (element.length !== 0) {
        let updatedNGOList = ngoList.map((ngo, index) => {
          if (updateKey === index) {
            return {
              ...ngo,
              isNgoVerified: true,
            };
          }
          return ngo;
        });
        await addOrUpdateCharacter({ ...ngo, isNgoVerified: true });
        setNgoList(updatedNGOList);
        invokeses(ngo.username);
      } else {
        alert();
      }
    }

    setTimeout(() => {
      console.log();
    }, 200);
    callingLambda().finally(() => setSelectedBtnId(-1));
  }

  return (
    <>
      <Grid container alignItems="stretch" spacing={3}>
        <Grid className="left-pane" item md={5} xs={12}>
          <Stack className="rotate">
            <img
              src="https://internetto.it/wp-content/uploads/2018/01/Bottone-impostazioni-Windows-2018-PNG.png "
              alt="admin"
            />
          </Stack>
          <ToastContainer />
        </Grid>
        <Grid className="right-pane" item md={7} xs={12}>
          <Stack className="image" style={{ display: "flex" }}>
            <Typography
              style={{
                color: "white",
                marginTop: "50px",
                fontSize: "30px",
                marginBottom: "0px",
              }}
            >
              Verify All NGOs
            </Typography>
            <Paper
              elevation={3}
              sx={{
                width: "80%",
                margin: "20px",
                height: "40rem",
                opacity: "0.8",
                background: "white",
              }}
            >
              <List sx={{ width: "100%" }}>
                {ngoList?.map((ngo, index) => (
                  <>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={ngo.name}
                        style={{ color: "black", fontWeight: "bold" }}
                      />
                      {ngo.isNgoVerified === true ? (
                        <DoneIcon style={{ margin: "5px", color: "green" }} />
                      ) : (
                        ""
                      )}
                      <Button
                        className={ngo.isNgoVerified ? "disabled" : "verify"}
                        variant="outlined"
                        id={ngo.documentKey}
                        onClick={() => handleClick(ngo, index)}
                        style={{
                          color: "green",
                          borderColor: "green",
                          fontWeight: "bolder",
                        }}
                      >
                        {selectedBtnId.toString() === ngo.documentKey
                          ? "Loading..."
                          : "Verify"}
                      </Button>
                    </ListItem>
                    <Divider component="li" />
                  </>
                ))}
              </List>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default Admin;
