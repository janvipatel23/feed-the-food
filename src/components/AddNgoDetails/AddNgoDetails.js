import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AWS from "aws-sdk";
import {
  Grid,
  Paper,
  TextField,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { useSnackbar } from "notistack";

import { updateNGOProperties } from "../../store/actions/items";

const AddNgoDetails = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const S3_BUCKET_NAME = "ngo-images-prod";
  const REGION = "us-west-2";

  AWS.config.update({
    accessKeyId: "",
    secretAccessKey: "",
    region: REGION,
  });

  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET_NAME },
  });

  const [ngoImage, setNgoImage] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleNGODescription = (event) => {
    setDescription(event.target.value);
  };

  const addImageToS3 = async (event) => {
    const params = {
      Body: event.target.files[0],
      Bucket: S3_BUCKET_NAME,
      Key: localStorage.getItem("username"),
      Expires: 60,
    };

    myBucket.upload(params, (err, response) => {
      if (err) {
        console.log(err);
      } else {
        setNgoImage(response.Location);
      }
    });
  };

  const addDetails = () => {
    let requestBody = [
      { updateKey: "ngoImage", updateValue: ngoImage },
      { updateKey: "description", updateValue: description },
    ];

    updateNGOProperties(localStorage.getItem("username"), requestBody).then(
      (response) => {
        if (response.status === 200) {
          var successKey = enqueueSnackbar("NGO details updated!", {
            variant: "success",
          });
          setTimeout(() => {
            closeSnackbar(successKey);
            navigate("/home");
          }, 2000);
        }
      }
    );
  };

  return (
    <>
      <Paper
        elevation={20}
        sx={{
          marginLeft: "10%",
          marginRight: "10%",
          marginTop: "5%",
          padding: "20px",
        }}
      >
        <Grid align="center" container>
          <Grid xs={12}>
            <Typography variant="h3">Add Details</Typography>
          </Grid>
          <Grid xs={12} mt={4} align="center">
            <Grid xs={8} align="left">
              {ngoImage === "" && (
                <div>
                  <Typography
                    align="left"
                    variant="h6"
                    gutterBottom
                    component="div"
                  >
                    Add Image for NGO {ngoImage}
                  </Typography>
                  <Tooltip title="Select an Image" arrow={true}>
                    <Button variant="outlined" component="label">
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={addImageToS3}
                        hidden
                      />
                    </Button>
                  </Tooltip>
                </div>
              )}
              {ngoImage !== "" && (
                <div>
                  <Typography
                    align="left"
                    variant="h6"
                    gutterBottom
                    component="div"
                  >
                    Image Selected:
                  </Typography>
                  <div
                    style={{ border: "1px solid #eee", textAlign: "center" }}
                  >
                    <img
                      alt=""
                      src={ngoImage}
                      style={{ padding: "20px" }}
                      width="50%"
                      height="50%"
                    />
                  </div>
                  <Button
                    style={{ marginTop: "2%" }}
                    onClick={() => setNgoImage("")}
                    variant="outlined"
                  >
                    Reselect Image
                  </Button>
                </div>
              )}
            </Grid>
          </Grid>
          <Grid xs={12} mt={3} align="center">
            <Grid xs={8}>
              <Typography
                align="left"
                variant="h6"
                gutterBottom
                component="div"
              >
                Description
              </Typography>
              <TextField
                id="outlined-multiline-static"
                label="Description"
                multiline
                rows={10}
                placeholder="Add description..."
                fullWidth
                value={description}
                onChange={handleNGODescription}
              />
            </Grid>
          </Grid>
          <Grid xs={12} mt={3} align="center">
            <Tooltip title="Add Selected Details" arrow={true}>
              <Button
                size="large"
                onClick={addDetails}
                variant="contained"
                sx={{ marginRight: "2%" }}
              >
                ADD DETAILS
              </Button>
            </Tooltip>

            <Tooltip title="Go to Home" arrow={true}>
              <Button
                size="large"
                onClick={() => navigate("/home")}
                variant="contained"
              >
                BACK
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default AddNgoDetails;
