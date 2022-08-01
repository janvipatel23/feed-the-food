import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getNGO } from "../../store/actions/items";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { Button, ListItem, Paper, Tooltip } from "@mui/material";
import ListItems from "../ViewItems/ListItems";

function DonationRequest() {
  const defaultImage =
    "https://static.vecteezy.com/system/resources/previews/005/295/671/non_2x/food-donation-concept-illustration-depicting-hands-donating-a-box-of-food-to-the-needy-and-poor-people-charity-benevolence-and-humanitarian-help-vector.jpg";

  const { username } = useParams();
  const [ngo, setNgo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getNGO(username).then((response) => {
      setNgo(response.data);
    });
  }, []);

  return (
    <>
      <Grid
        container
        spacing={0}
        direction="row"
        justifyContent="center"
        my={10}
      >
        <Grid item xs={9}>
          <Card
            sx={{
              minWidth: "70%",
              borderTop: "3px solid #1565c0",
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            }}
          >
            <CardContent>
              <Typography
                variant="h2"
                component="div"
                style={{ textAlign: "center" }}
              >
                Donate To
              </Typography>
              <Grid display={"flex"} justifyContent={"space-between"} mx={3}>
                <Grid xs={8} item>
                  <Box>
                    <h3 style={{ color: "black", fontWeight: "bolder" }}>
                      NGO Name : <br />{" "}
                      <span style={{ color: "green" }}> {ngo.name}</span>
                    </h3>
                  </Box>
                  <Box>
                    <p>
                      <strong>NGO Description : </strong>
                      <br />
                      {ngo.description}
                    </p>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Paper variant="outlined">
                    <img
                      width={250}
                      height={300}
                      src={ngo.ngoImage ? ngo.ngoImage : defaultImage}
                      alt="NGO"
                    />
                  </Paper>
                  <Tooltip title="Request to Donate" arrow={true}>
                    <Box mt={2}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        style={{ borderRadius: "15px" }}
                        onClick={() => navigate(`/donation/${ngo.username}`)}
                        fullWidth
                        disabled={
                          ngo.donate === undefined || ngo.donate.length < 1
                        }
                      >
                        Make Donation Request
                      </Button>
                    </Box>
                  </Tooltip>
                </Grid>
              </Grid>

              <Box mx={3}>
                <ListItems items={ngo.donate} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default DonationRequest;
