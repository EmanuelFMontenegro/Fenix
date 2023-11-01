import React from "react";
import { Link } from "react-router-dom";
import "./sidebar.scss";
import {
  Face as FaceIcon,
  AccessibilityNew as AccessibilityNewIcon,
  CreditCard as CreditCardIcon,
  Settings as SettingsIcon,
  AccountCircleOutlined as AccountCircleOutlinedIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import DeteccionFacial from "../deteccion/DeteccionFacial";
import Asistencia from "../asistencia/Asistencia";
import logoImage from "../../assets/Fenix.jpg";



import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Elimina el token de autenticación.
    window.location.href = "/login"; 
  }; 


  const handleButtonClick = (route) => {
    console.log("Navigating to:", route);
    navigate(route);
  };

  return (
    <div className="sidebar">
      <div className="top">
        <img src={logoImage} alt="Logo" className="logo" />
        <span className="text-logo">Fenix Detection</span>
      </div>
      <hr className="divider" />
      <div className="center">
        <ul>
          <li>
            <p className="title">Inicio</p>
          </li>
          <li>
            <p className="title">Navegacion Fenix</p>
          </li>
          <li>
            <div
              className="nav-button"
              onClick={() =>
                handleButtonClick({
                  title: "Detección Facial",
                  component: <DeteccionFacial />,
                })
              }
            >
              <FaceIcon className="icon" />
              <span>Detección Facial</span>
            </div>
          </li>
          <li>
            <div
              className="nav-button"
              onClick={() =>
                handleClick({
                  title: "Asistencia",
                  component: <Asistencia />,
                })
              }
            >
              <AccessibilityNewIcon className="icon" />
              <span>Asistencias</span>
            </div>
          </li>
          <li>
            <Link to="/Empleados" className="nav-link">
              <div className="nav-button">
                <CreditCardIcon className="icon" />
                <span>Empleados</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/" className="nav-link">
              <div className="nav-button">
                <SettingsIcon className="icon" />
                <span>Administrador</span>
              </div>
            </Link>
          </li>
          <li>
            <p className="title">Usuarios</p>
          </li>
          <li>
            <Link to="/profile" className="nav-link">
              <div className="nav-button">
                <AccountCircleOutlinedIcon className="icon" />
                <span>Perfil</span>
              </div>
            </Link>
          </li>
          <li>
          <Link to="/logout" className="nav-link">
              <div className="nav-button" onClick={handleLogout}>
                <ExitToAppIcon className="icon" />
                <span>Salir</span>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
