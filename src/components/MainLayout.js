import {
  AppBar,
  Box,
  IconButton,
  Paper,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "./auth/AuthLayout";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  AdminAuthConfigure,
  DonorAuthConfigure,
  NGOAuthConfigure,
} from "./auth/DonorAuthUtil";
import { Auth } from "aws-amplify";

export const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    let userType = localStorage.getItem("userType");
    localStorage.removeItem("userType");
    if (userType === "ADMIN") {
      AdminAuthConfigure();
    } else if (userType === "NGO") {
      NGOAuthConfigure();
    } else {
      DonorAuthConfigure();
    }

    Auth.signOut().finally(() => navigate("/signIn"));
  };

  if (location.pathname === "/home") {
    return <Paper>{children}</Paper>;
  }

  if (
    location.pathname === "/signIn" ||
    location.pathname === "/ngoSignUp" ||
    location.pathname === "/donorSignUp" ||
    location.pathname === "/forgotPassword" ||
    location.pathname === "/"
  ) {
    return <AuthLayout>{children}</AuthLayout>;
  }

  return (
    <>
      <Box>
        <AppBar
          position="static"
          style={{ backgroundColor: "#156fc0", margin: "0px !important" }}
        >
          <div>
            <Toolbar
              variant="dense"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Link
                to={
                  localStorage.getItem("userType") === "NGO"
                    ? "/home"
                    : localStorage.getItem("userType") === "DONOR"
                    ? "/donor"
                    : "/admin"
                }
                style={{ textDecoration: "none" }}
              >
                <Tooltip title="Home" arrow={true}>
                  <Typography
                    variant="h6"
                    color="inherit"
                    component="div"
                    style={{
                      alignItems: "flex-start",
                      color: "white",
                      textDecoration: "none",
                    }}
                  >
                    Feed The Food
                  </Typography>
                </Tooltip>
              </Link>
              <Tooltip title="Logout" arrow={true}>
                <Box>
                  <IconButton
                    style={{ cursor: "pointer", color: "#FFFFFF" }}
                    onClick={handleLogout}
                  >
                    <LogoutIcon />
                  </IconButton>
                </Box>
              </Tooltip>
            </Toolbar>
          </div>
        </AppBar>
      </Box>
      <div>
        <Box>{children}</Box>
        <Box
          style={{
            textAlign: "center",
            padding: "12px",
            bottom: "0",

            backgroundColor: "#156fc0",
            color: "white",
          }}
        >
          <Typography>FeedTheFood Application</Typography>
        </Box>
      </div>
    </>
  );
};
