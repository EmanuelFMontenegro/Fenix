import React, { useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);

  const changeProfile = async (profileId) => {
    try {
      const response = await axios.post("/change-profile", { profileId });

      if (response.data.success) {
        console.log("Perfil cambiado a ${profileId}");
        setSelectedProfile(profileId);
      } else {
        console.error("Error al cambiar el perfil:", response.data.message);
      }
    } catch (error) {
      console.error("Error al cambiar el perfil:", error);
    }
  };

  return (
    <div className="container">
      <div className="profile-selector">
        <h1>Seleccionar Perfil</h1>
        <button className="boton1" onClick={() => changeProfile(1)}>
          Perfil 1 (Administrador)
        </button>
        <button className="boton2" onClick={() => changeProfile(2)}>
          Perfil 2 (Otro rol)
        </button>
        <button className="boton3" onClick={() => changeProfile(3)}>
          Perfil 3 (Otro rol)
        </button>
      </div>
    </div>
  );
};

export default Profile;
