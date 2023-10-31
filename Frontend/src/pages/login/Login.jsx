import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./login.scss";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [formData, setFormData] = useState({
    user: "",
    pass: "",
  });

  const navigate = useNavigate();

  // Función para manejar cambios en los campos de entrada
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  console.log("Credenciales de inicio de sesión:", formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.user.trim() !== "" && formData.pass.trim() !== "") {
        const userData = {
          user: formData.user,
          pass: formData.pass,
        };

        const response = await axios.post(
          "http://localhost:4000/login",
          userData
        );
        console.log("response.data.success:", response.data.success);

        if (response.data.success === true) {
          localStorage.setItem("authToken", response.data.token);
          toast.success("Inicio de sesión exitoso");
          navigate("/Sidebar");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        if (
          error.response.data.message ===
          "Usuario no encontrado en la base de datos"
        ) {
          toast.error("Nombre de usuario incorrecto", {
            className: "toast-error show",
          });
        } else if (error.response.data.message === "Contraseña incorrecta") {
          toast.error("Contraseña incorrecta", {
            className: "toast-error show",
          });
        }
      }
    }
  };

  return (
    <div className="login-container">
      <Form className="login-form" onSubmit={handleSubmit}>
        <h2 className="mb-4">Inicio de Sesión</h2>
        <Form.Group controlId="username">
          <Form.Label className="login-label">Nombre de usuario</Form.Label>
          <Form.Control
            type="text"
            name="user"
            value={formData.user}
            onChange={handleInputChange}
            required
            className="login-input"
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label className="login-label">Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="pass"
            value={formData.pass}
            onChange={handleInputChange}
            required
            className="login-input"
          />
        </Form.Group>
        <Button variant="custom" type="submit" className="btn-custom">
          Iniciar Sesión
        </Button>
        <Link to="/forgot-password" className="login-link">
          Recuperar Contraseña
        </Link>
        <div className="register-link">
          <span className="login-text">¿No estás registrado? </span>
          <Link to="/admin-registration" className="login-link">
            Registrarse
          </Link>
        </div>
      </Form>

      <ToastContainer />
    </div>
  );
}

export default Login;
