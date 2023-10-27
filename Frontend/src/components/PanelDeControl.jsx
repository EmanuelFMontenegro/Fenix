import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FaceIcon from '@mui/icons-material/Face';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useNavigate } from 'react-router-dom'; 

const PanelDeControl = () => {
  const navigate = useNavigate(); 

  const middleIcons = [
    {
      label: 'Panel de Control',
      icon: <DashboardIcon className="icon" />,
      link: '/paneldecontrol',
    },
    {
      label: 'Detección Facial',
      icon: <FaceIcon className="icon" />,
      link: '/DeteccionFacial',
    },
    {
      label: 'Asistencia',
      icon: <AccessibilityNewIcon className="icon" />,
      link: '/Asistencia',
    },
    {
      label: 'Empleados',
      icon: <CreditCardIcon className="icon" />, 
      link: '/Empleados',
    },
    {
      label: 'Áreas',
      icon: <CreditCardIcon className="icon" />, 
      link: '/Areas',
    },
    {
      label: 'Administrador',
      icon: <CreditCardIcon className="icon" />, 
      link: '/Administrador',
    },
    {
      label: 'Perfil',
      icon: <CreditCardIcon className="icon" />, 
      link: '/Profile',
    },
    {
      label: 'Salir',
      icon: <CreditCardIcon className="icon" />, 
      link: '/Logout',
    },
  ];

  const handleNavigation = (link) => {
    navigate(link);
  };

  return (
    <div className="panel-control">
      <div className="grid-container">
        <Sidebar />

        <div className="center">
          <div className="middle-icons">
            {middleIcons.map((item, index) => (
              <button
                key={index}
                className="nav-button"
                onClick={() => handleNavigation(item.link)}
              >
                {item.icon}
                <span className="text">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelDeControl;