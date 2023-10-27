import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./pages/home/home";
import AdminRegistration from './components/AdminRegistration';
import Login from './pages/login/Login';
import ForgotPassword from './components/ForgotPassword';
import Administrador from './components/Administrador';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthenticationGuard from './components/AuthenticationGuard';
import PanelDeControl from "./components/PanelDeControl"; // Asegúrate de importar PanelDeControl desde la ubicación correcta
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
                    <Route path="/" element={<Home />} /> {/* Ruta raíz muestra el componente Home */}
                    <Route path="/paneldecontrol" element={<PanelDeControl />} /> {/* Agrega esta ruta */}
                    <Route path="/administrador" element={<Administrador />} />
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
