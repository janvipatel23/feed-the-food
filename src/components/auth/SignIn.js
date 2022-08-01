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
import { useNavigate, Link } from "react-router-dom";
import {
  AdminAuthConfigure,
  DonorAuthConfigure,
  NGOAuthConfigure,
  SignInAsDonor,
} from "./DonorAuthUtil";
import { useSnackbar } from "notistack";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [credential, setCredential] = useState({
    type: "NGO",
    email: "",
    password: "",
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
    setLoading(true);
    if (credential.type === "DONOR") {
      DonorAuthConfigure();
    } else if (credential.type === "NGO") {
      NGOAuthConfigure();
    } else {
      AdminAuthConfigure();
    }

    SignInAsDonor(credential.email, credential.password)
      .then((res) => {
        var successKey = enqueueSnackbar("Successfully Logged in", {
          variant: "success",
        });
        setTimeout(() => closeSnackbar(successKey), 3000);
        localStorage.setItem("userType", credential.type);
        localStorage.setItem("username", credential.email);
        localStorage.setItem(
          "token",
          res.getSignInUserSession().getIdToken().getJwtToken()
        );
        if (credential.type === "NGO") {
          navigate("/home");
        } else if (credential.type === "ADMIN") {
          navigate("/admin");
        } else if (credential.type === "DONOR") {
          navigate("/donor");
        }
      })
      .catch((err) => {
        var errorKey = enqueueSnackbar(err.message, { variant: "error" });
        setTimeout(() => closeSnackbar(errorKey), 3000);
      })
      .finally(() => setLoading(false));
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
              Welcome to <br /> Happy Food Feed!!
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
                    onChange={onSelectChange}
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
                  onChange={onInputChange}
                  fullWidth
                  required
                />
              </Box>
              <Box width="80%" m={5}>
                <TextField
                  id="password"
                  label="Password"
                  variant="outlined"
                  type="password"
                  value={credential.password}
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
                  Login
                </LoadingButton>
              </Box>
            </Box>

            <Typography variant="p" component="div" m={1}>
              <Link to="/forgotPassword">Forgot Password?</Link>
            </Typography>

            <Divider orientation="horizontal" flexItem>
              OR
            </Divider>
            <Box m={1}>
              <Button
                onClick={() => navigate("/ngoSignUp")}
                variant="contained"
                disabled={loading}
              >
                Create a NGO Account
              </Button>
            </Box>
            <Box m={1}>
              <Button
                variant="contained"
                disabled={loading}
                onClick={() => navigate("/donorSignUp")}
              >
                Create a Donar Account
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
