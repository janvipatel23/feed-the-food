import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Auth } from "aws-amplify";

export default function ForgotPasswordVerification({ email }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [credential, setCredential] = useState({
    type: "DONOR",
    code: "",
    email: email,
    newpassword: "",
  });

  const onInputChange = (event) => {
    setCredential({
      ...credential,
      [event.target.id]: event.target.value,
    });
  };

  const onSelectChange = (event) => {
    setCredential({
      ...credential,
      type: event.target.value,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (credential.type === "DONOR" || credential.type === "NGO") {
      setLoading(true);
      
      Auth.forgotPasswordSubmit(credential.email, credential.code, credential.newpassword)
        .then((res) => {
          enqueueSnackbar("Password has been updated successfully.", {
            variant: "success",
          });

          navigate('/signIn');
        })
        .catch((err) => {
          enqueueSnackbar(err.message, { variant: "error" });
        })
        .finally(() => setLoading(false));
    } else {
      enqueueSnackbar(
        "Forgot password for NGO and Admin are under development..",
        {
          variant: "info",
        }
      );
    }
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
              Set New Password
            </Typography>

            <Box component={"form"} my={2} onSubmit={handleFormSubmit}>
              <Box width="80%" m={5}>
                <FormControl fullWidth>
                  <InputLabel id="role-select-label">Login as</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="type"
                    label="Login as"
                    value={credential.type}
                    disabled
                  >
                    <MenuItem value="NGO">NGO</MenuItem>
                    <MenuItem value="DONOR">DONOR</MenuItem>
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box width="80%" m={5}>
                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  value={credential.email}
                  disabled
                  fullWidth
                />
              </Box>
              <Box width="80%" m={5}>
                <TextField
                  id="code"
                  label="Code"
                  type={"number"}
                  variant="outlined"
                  value={credential.code}
                  onChange={onInputChange}
                  fullWidth
                  required
                />
              </Box>
              <Box width="80%" m={5}>
                <TextField
                  id="newpassword"
                  label="New Password"
                  variant="outlined"
                  type="password"
                  value={credential.newpassword}
                  onChange={onInputChange}
                  required
                  fullWidth
                />
              </Box>
              <Box width="80%" ml={5} mb={2}>
                <LoadingButton
                  type="submit"
                  loading={loading}
                  loadingIndicator="Verifying..."
                  variant="outlined"
                  fullWidth
                >
                  Update Password
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
  );
}
