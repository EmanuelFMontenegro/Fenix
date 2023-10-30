import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import DeteccionFacial from "../../components/deteccion/DeteccionFacial";
import PanelDeControl from "../../components/PanelDeControl";
import "../home/home.scss";

const Home = () => {
  const [componentToRender, setComponentToRender] = useState(null);

  const handleButtonClick = (component) => {
    setComponentToRender(component);
  };

  return (
    <div className="home">
      <div className="homeContainer">
        <div className="header">
          <h2>
            {componentToRender && componentToRender.props
              ? componentToRender.props.title
              : "Bienvenido a Fenix"}
          </h2>
        </div>
        <div className="body">
          <div className="componentArea">
            <Sidebar handleButtonClick={handleButtonClick} />
            <PanelDeControl />
          </div>
        </div>
        <div className="footer">Pie de página</div>
      </div>
    </div>
  );
};

export default Home;
