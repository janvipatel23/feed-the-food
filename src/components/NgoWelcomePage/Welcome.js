import React, { useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import { BsFillCheckCircleFill } from "react-icons/bs";

import welcome from "../../assets/bg-3.jpg";
import verified from "../../assets/download.jpg";
import { Link, useNavigate } from "react-router-dom";
import { getNGO } from "../../store/actions/items";
import {
  AdminAuthConfigure,
  DonorAuthConfigure,
  NGOAuthConfigure,
} from "../auth/DonorAuthUtil";
import { Auth } from "aws-amplify";

const Welcome = () => {
  const navigate = useNavigate();
  const [ngo, setNGO] = useState();

  useEffect(() => {
    getNGO(localStorage.getItem("username")).then((response) => {
      setNGO(response.data);
    });
  }, []);

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

  return (
    <div
      style={{
        backgroundImage: `url(${welcome})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        overflow: "hidden",
      }}
    >
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Grid item xs={3}>
          <h1
            style={{ color: "white", fontSize: "300%", position: "relative" }}
          >
            Welcome to Dashboard{" "}
            <span
              style={{
                position: "absolute",
                bottom: "-7px",
                marginLeft: "10px",
              }}
            >
              {ngo && ngo.isNgoVerified ? (
                <BsFillCheckCircleFill color="green" />
              ) : (
                ""
              )}
            </span>
          </h1>
          <div style={{ textAlign: "center" }}>
            <Link
              style={{
                color: "white",
                textDecoration: "none",
                marginRight: "2%",
              }}
              to={"/adddetails"}
            >
              <Button variant="contained">ADD DESCRIPTION</Button>
            </Link>

            <Link
              style={{
                color: "white",
                textDecoration: "none",
                marginRight: "2%",
              }}
              to={"/items"}
            >
              <Button variant="contained">ADD ITEMS</Button>
            </Link>

            <Link
              style={{
                color: "white",
                textDecoration: "none",
                marginRight: "2%",
              }}
              to={"/ngoDonationPage"}
            >
              <Button variant="contained">DONATION</Button>
            </Link>

            <Button variant="contained" color="error" onClick={handleLogout}>
              LOGOUT
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Welcome;
