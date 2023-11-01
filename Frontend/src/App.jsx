import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./pages/home/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminRegistration from "./components/adminregistration/AdminRegistration";
import Login from "./pages/login/Login";
import ForgotPassword from "./components/forgotpassword/ForgotPassword";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthenticationGuard from "./components/authenticationguard/AuthenticationGuard";
import PanelDeControl from "./components/paneldecontrol/PanelDeControl";
import "react-toastify/dist/ReactToastify.css";
import Empleados from "./components/empleados/Empleados";
import Profile from "./components/profile/Profile";

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin-registration" element={<AdminRegistration />} />
          <Route
            path="*"
            element={
              <AuthenticationGuard>
                <div className="container">
                  <Sidebar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/paneldecontrol" element={<PanelDeControl />} />
                    <Route path="/Empleados" element={<Empleados />} />
                    <Route path="/Profile" element={<Profile />} />
                  </Routes>
                </div>
              </AuthenticationGuard>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
};

export default App;
