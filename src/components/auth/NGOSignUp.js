import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Button, Divider, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { CreateAccountInDonorPool, NGOAuthConfigure } from "./DonorAuthUtil";
import DonorSignUpConfirmation from "./DonorSignUpConfirmation";
import { MdAdd } from "react-icons/md";
import AWS from "aws-sdk";

export default function NGOSignUp() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isSignedUpPage, setSignUpPage] = useState(true);

  const S3_BUCKET = "ngo-document-upload-bucket-prod";
  const REGION = "us-west-2";

  AWS.config.update({
    accessKeyId: "",
    secretAccessKey: "",
  });

  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  const [credential, setCredential] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    file: "",
  });

  const onInputChange = (event) => {
    setCredential({
      ...credential,
      [event.target.id]: event.target.value,
    });
  };

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileInput = ({ target }) => {
    setCredential({
      ...credential,
      file: target.files[0],
    });
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    if (credential.confirmPassword !== credential.password) {
      const key = enqueueSnackbar("Password doesn't match", {
        variant: "error",
      });
      setTimeout(() => closeSnackbar(key), 2000);
      return;
    } else if (credential.file === "") {
      const key = enqueueSnackbar("File not added!", {
        variant: "error",
      });
      setTimeout(() => closeSnackbar(key), 2000);
      return;
    }
    setLoading(true);
    NGOAuthConfigure();
    CreateAccountInDonorPool(
      credential.name,
      credential.email,
      credential.password
    )
      .then((res) => {
        enqueueSnackbar(
          "Successfully created account. Please verify the email and do sign in.",
          {
            variant: "success",
          }
        );

        const params = {
          ACL: "public-read",
          Body: credential.file,
          Bucket: S3_BUCKET,
          Key: new Date().getTime().toString(),
          Tagging: `username=${credential.email}&name=${credential.name}`,
        };

        myBucket.putObject(params).send((err) => {
          if (err) console.log(err);
        });
        setSignUpPage(false);
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return isSignedUpPage ? (
    <Grid
      container
      spacing={0}
      direction="row"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Grid item xs={3}>
        <Card
          sx={{
            minWidth: 400,
            borderTop: "3px solid #1565c0",
            boxShadow: "25px 25px 51px #a6a3b2, -25px -25px 51px #cac2d7",
          }}
        >
          <CardContent style={{ textAlign: "center" }}>
            <Typography variant="h5" component="div">
              Welcome to <br /> Happy Food Feed!!
            </Typography>

            <Typography variant="h6" component="div" mt={3}>
              Create a NGO Account
            </Typography>

            <Box component={"form"} onSubmit={handleSignUp}>
              <Box width="80%" m={4}>
                <TextField
                  id="name"
                  label="Name"
                  type={"text"}
                  variant="outlined"
                  value={credential.name}
                  onChange={onInputChange}
                  fullWidth
                  required
                />
              </Box>
              <Box width="80%" m={4}>
                <TextField
                  id="email"
                  label="Email"
                  type={"email"}
                  variant="outlined"
                  value={credential.email}
                  onChange={onInputChange}
                  fullWidth
                  required
                />
              </Box>
              <Box width="80%" m={4}>
                <TextField
                  id="password"
                  type={"password"}
                  label="Password"
                  variant="outlined"
                  value={credential.password}
                  onChange={onInputChange}
                  fullWidth
                  required
                />
              </Box>
              <Box width="80%" m={4}>
                <TextField
                  id="confirmPassword"
                  label="Confirm Password"
                  variant="outlined"
                  type={"password"}
                  value={credential.confirmPassword}
                  onChange={onInputChange}
                  fullWidth
                  required
                />
              </Box>
              <Box width="80%" m={4}>
                <Button variant="contained" component="label" color="primary">
                  {" "}
                  <MdAdd /> Upload a file
                  <input type="file" onChange={handleFileInput} hidden />
                </Button>
              </Box>

              <Box width="75%" ml={5} mb={2}>
                <LoadingButton
                  loading={loading}
                  loadingIndicator="Doing Sign up"
                  variant="outlined"
                  fullWidth
                  type="submit"
                >
                  Sign up
                </LoadingButton>
              </Box>
            </Box>

            <Divider orientation="horizontal" flexItem>
              OR
            </Divider>
            <Box m={1}>
              <Button
                variant="contained"
                disabled={loading}
                onClick={() => navigate("/signIn")}
              >
                Back to Sign in
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  ) : (
    <DonorSignUpConfirmation email={credential.email} />
  );
}
