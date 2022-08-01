import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import DonorSignUp from "./components/auth/DonorSignUp";
import ForgotPassword from "./components/auth/ForgotPassword";
import SignIn from "./components/auth/SignIn";
import Items from "./components/Items/Items";
import NGOSignUp from "./components/auth/NGOSignUp";
import Welcome from "./components/NgoWelcomePage/Welcome";
import AddNgoDetails from "./components/AddNgoDetails/AddNgoDetails";
import Admin from "./components/Admin/Admin";
import DonorHome from "./components/Donor/DonorHome";
import axios from "axios";
import DonationRequest from "./components/Donor/DonationRequest";
import Donate from "./components/Donor/Donate";
import { MainLayout } from "./components/MainLayout";
import NGODonationPage from "./components/NGODonationPage/NGODonationPage";
import AuthGuardComponent from "./AuthGuardComponent";

const App = () => {
  // Add a request interceptor
  const navigate = useNavigate();
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = "Bearer " + token;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    function (error) {
      if (error.response?.status === 401) {
        navigate("/signIn");
      }
      return Promise.reject(error);
    }
  );

  return (
    <MainLayout>
      <Routes>
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/donorSignUp" element={<DonorSignUp />} />
        <Route path="/ngoSignUp" element={<NGOSignUp />} />
        <Route path="/" element={<SignIn />} />
        <Route
          path="/home"
          element={
            <AuthGuardComponent>
              <Welcome />
            </AuthGuardComponent>
          }
        />
        <Route
          path="/items"
          element={
            <AuthGuardComponent>
              <Items />
            </AuthGuardComponent>
          }
        />
        <Route
          path="/donor"
          element={
            <AuthGuardComponent>
              <DonorHome />
            </AuthGuardComponent>
          }
        />
        <Route
          path="/adddetails"
          element={
            <AuthGuardComponent>
              <AddNgoDetails />
            </AuthGuardComponent>
          }
        />
        <Route
          path="/admin"
          element={
            <AuthGuardComponent>
              <Admin />
            </AuthGuardComponent>
          }
        />
        <Route
          path="/donate/:username"
          element={
            <AuthGuardComponent>
              <DonationRequest />
            </AuthGuardComponent>
          }
        />
        <Route
          path="/donation/:username"
          element={
            <AuthGuardComponent>
              <Donate />
            </AuthGuardComponent>
          }
        />
        <Route
          path="/ngoDonationPage"
          element={
            <AuthGuardComponent>
              <NGODonationPage />
            </AuthGuardComponent>
          }
        />
      </Routes>
    </MainLayout>
  );
};

export default App;
