import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import { getNGOList } from "../../store/actions/items";
import { useNavigate } from "react-router-dom";
import TranscribeInput from "./TranscribeInput";
import axios from "axios";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function DonorHome() {
  const [ngoList, setNgoList] = useState([]);
  const [api_key, setApiKey] = useState("");
  const navigate = useNavigate();
  const isChecked = true;
  const defaultImage =
    "https://static.vecteezy.com/system/resources/previews/005/295/671/non_2x/food-donation-concept-illustration-depicting-hands-donating-a-box-of-food-to-the-needy-and-poor-people-charity-benevolence-and-humanitarian-help-vector.jpg";

  useEffect(() => {
    axios
      .get(
        "http://back-feed-the-food-env.eba-zmzu7suc.us-west-2.elasticbeanstalk.com/getSecret"
      )
      .then((res) => {
        let result = res.data.split('"');
        getNGOList(result[0] + "i").then((response) => {
          setNgoList(response.data);
        });
      });
  }, []);

  return (
    <>
      <Grid container alignItems="stretch" spacing={3}>
        <Grid className="left-pane" item md={5} xs={12}>
          <Stack>
            <img
              style={{ padding: "10px", marginTop: "5rem" }}
              src="https://media.istockphoto.com/vectors/food-and-grocery-donation-vector-id1223169200?k=20&m=1223169200&s=612x612&w=0&h=HdRe-KEfLCvnpSTAcNf4OTR-D3B0-OMCQpLEEn2beiU="
              alt="donor"
            />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Typography
            align="center"
            style={{
              border: "1px dashed black",
              color: "#156fc0",
              fontWeight: "bolder",
              fontSize: "2rem",
              margin: "2rem",
            }}
          >
            {" "}
            Introduce Yourself to NGO
          </Typography>
          <Box my={2}>
            <TranscribeInput></TranscribeInput>
          </Box>
          <Typography
            align="center"
            style={{
              border: "1px dashed black",
              color: "#156fc0",
              fontWeight: "bolder",
              fontSize: "2rem",
              margin: "2rem",
            }}
          >
            {" "}
            Verified NGOs
          </Typography>
          <Grid container style={{ margin: "1rem" }}>
            {ngoList.map((ngo) => (
              <Grid item md={3} style={{ margin: "1rem" }} key={ngo.id}>
                <Tooltip title="Click to get the details" arrow={true}>
                  <Zoom in={isChecked} timeout={800}>
                    <Card
                      elevation={5}
                      sx={{ maxWidth: 345 }}
                      style={{ backgroundColor: "#156fc0" }}
                      onClick={() => navigate(`/donate/${ngo.username}`)}
                    >
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="200"
                          image={ngo.ngoImage ? ngo.ngoImage : defaultImage}
                          alt="green iguana"
                        />
                        <CardContent>
                          <Typography variant="body2" color="white">
                            {ngo.name}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Zoom>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default DonorHome;
