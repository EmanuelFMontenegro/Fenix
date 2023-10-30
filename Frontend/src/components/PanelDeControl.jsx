import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom'; 

const PanelDeControl = () => {
  const navigate = useNavigate(); 



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