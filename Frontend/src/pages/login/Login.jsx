import React, { useState } from "react";
import "./login.scss"; // Asegúrate de tener un archivo de estilos para el login (login.scss)

const Login = ({ handleLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    contraseña: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(formData);
  };

  return (
    <div className="login">
      <div className="top">
        <h2 className="login-title">Iniciar Sesión</h2>
      </div>
      <hr className="divider" />
      <div className="center">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="login-input"
          />
          <input
            type="password"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            placeholder="Contraseña"
            className="login-input"
          />
          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
