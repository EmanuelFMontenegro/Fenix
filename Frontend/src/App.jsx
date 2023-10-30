import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./pages/home/Home";
import AdminRegistration from './components/AdminRegistration';
import Login from './pages/login/Login';
import ForgotPassword from './components/ForgotPassword';
import Administrador from './components/Administrador';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthenticationGuard from './components/AuthenticationGuard';
import PanelDeControl from "./components/PanelDeControl"; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Empleados from '../src/components/Empleados'
import Profile from '../src/components/Profile';



const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <ToastContainer />
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
                    <Route path="/administrador" element={<Administrador />} />
                    <Route path="/Empleados" element={<Empleados />} />
                    <Route path="/Profile" element={<Profile />} />
                  </Routes>
                </div>
              </AuthenticationGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
