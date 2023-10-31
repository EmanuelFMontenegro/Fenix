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
import PanelDeControl from "../paneldecontrol/PanelDeControl";

const Sidebar = ({ handleButtonClick }) => {
  const handleClick = (component) => {
    handleButtonClick(component);

    const handleLogout = () => {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
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
              <Link to="/paneldecontrol" className="nav-link">
                <div className="nav-button">
                  <DashboardIcon className="icon" />
                  <span className="text">Panel de Control</span>
                </div>
              </Link>
            </li>
            <li>
              <p className="title">Navegacion Fenix</p>
            </li>
            <li>
              <Link to="/DeteccionFacial" className="nav-link">
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
                  <span>Detección Facial</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/Asistencia" className="nav-link">
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
              </Link>
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
};
export default Sidebar;
