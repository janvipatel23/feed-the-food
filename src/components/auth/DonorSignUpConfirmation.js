import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Grid, TextField } from "@mui/material";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { confirmDonorAccount } from "./DonorAuthUtil";

export default function DonorSignUpConfirmation({ email }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [code, setCode] = useState("");

  const onInputChange = (event) => {
    setCode(event.target.value);
  };

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    confirmDonorAccount(email, code)
      .then((res) => {
        enqueueSnackbar("Your account has been verified", {
          variant: "success",
        });
        navigate("/signIn");
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
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
              Confirm you account
            </Typography>

            <Typography variant="h6" component="div" mt={3}>
              Please enter a code
            </Typography>

            <Box component={"form"} onSubmit={handleSignUp}>
              <Box width="80%" m={4}>
                <TextField
                  id="email"
                  label="email"
                  type={"text"}
                  variant="outlined"
                  value={email}
                  disabled
                  fullWidth
                />
              </Box>
              <Box width="80%" m={4}>
                <TextField
                  id="code"
                  label="Code"
                  type={"number"}
                  variant="outlined"
                  value={code}
                  onChange={onInputChange}
                  fullWidth
                  required
                />
              </Box>
              <Box width="75%" ml={5} mb={2}>
                <LoadingButton
                  loading={loading}
                  loadingIndicator="Confirming code"
                  variant="outlined"
                  fullWidth
                  type="submit"
                >
                  Confirm
                </LoadingButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
