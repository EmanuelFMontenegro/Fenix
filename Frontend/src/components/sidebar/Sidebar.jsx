import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./sidebar.scss";
import {
  Dashboard as DashboardIcon,
  Face as FaceIcon,
  AccessibilityNew as AccessibilityNewIcon,
  CreditCard as CreditCardIcon,
  LocationOn as LocationOnIcon,
  Settings as SettingsIcon,
  AccountCircleOutlined as AccountCircleOutlinedIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import DeteccionFacial from "../deteccion/DeteccionFacial";
import Asistencia from "../asistencia/Asistencia";
import logoImage from "../../assets/Fenix.jpg";

const Sidebar = ({ handleButtonClick }) => {
  const handleClick = (component) => {
    handleButtonClick(component); // Llama a la función recibida como prop
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
          <p className="title">Inicio</p>
          <li>
            <button className="nav-button">
              <DashboardIcon className="icon" />
              <span className="text">Panel de Control</span>
            </button>
          </li>
          <p className="title">Navegacion Fenix</p>

          <Link to="/DeteccionFacial" className="nav-link">
            <li>
              <div
                className="nav-button"
                onClick={() =>
                  handleClick({
                    title: "Detección Facial",
                    component: <DeteccionFacial />,
                  })
                }
              >
                <FaceIcon className="icon" />
                <span>Deteccion Facial</span>
              </div>
            </li>
          </Link>

          <Link to="/Asistencia" className="nav-link">
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
          </Link>
          <Link to="../Empleados.jsx" className="nav-link">
            <li>
              <button className="nav-button">
                <CreditCardIcon className="icon" />
                <span>Empleados</span>
              </button>
            </li>
          </Link>
          <Link to="../Areas.jsx" className="nav-link">
            <li>
              <button className="nav-button">
                <LocationOnIcon className="icon" />
                <span>Areas</span>
              </button>
            </li>
          </Link>
          <Link to="../" className="nav-link">
            <li>
              <button className="nav-button">
                <SettingsIcon className="icon" />
                <span>Administrador</span>
              </button>
            </li>
          </Link>
          <p className="title">Usuarios</p>
          <Link to="/profile" className="nav-link">
            <li>
              <button className="nav-button">
                <AccountCircleOutlinedIcon className="icon" />
                <span>Perfil</span>
              </button>
            </li>
          </Link>
          <Link to="/logout" className="nav-link">
            <li>
              <button className="nav-button">
                <ExitToAppIcon className="icon" />
                <span>Salir</span>
              </button>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
