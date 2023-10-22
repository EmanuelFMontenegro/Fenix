import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./pages/home/home";
import AdminRegistration from './components/AdminRegistration';
import Login from './pages/login/Login';
import ForgotPassword from './components/ForgotPassword';
import Administrador from './components/Administrador';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthenticationGuard from './components/AuthenticationGuard'; // Asegúrate de usar el nombre correcto

import { ToastContainer } from 'react-toastify'; // Importa ToastContainer
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <ToastContainer /> {/* Agrega el ToastContainer aquí */}
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="*"
            element={
              <AuthenticationGuard>
                <div className="container">
                  <Sidebar />
                  <Home />
                </div>
              </AuthenticationGuard>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin-registration" element={<AdminRegistration />} />
          <Route path="/administrador" element={<Administrador />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;