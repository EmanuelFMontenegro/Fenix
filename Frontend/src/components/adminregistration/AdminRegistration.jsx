import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminRegistration.css";

function AdminRegistration() {
  const [formData, setFormData] = useState({
    user: "",
    pass: "",
    correo: "",
  });

  const [validationErrors, setValidationErrors] = useState([]);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors([]);

    try {
      if (
        formData.user.trim() !== "" &&
        formData.pass.trim() !== "" &&
        formData.correo.trim() !== ""
      ) {
        const response = await axios.post(
          "http://localhost:4000/signup",
          formData
        );

        if (response.data.success) {
          toast.success("Registro exitoso. Redirigiendo...", {
            autoClose: 1000,
            onClose: () => navigate("/Login"),
          });
        }
      } else {
        console.error("Por favor, complete todos los campos.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (error.response.data.message === "CorreoExistente") {
          toast.error(
            "El correo electrónico ya está en uso. Por favor, ingrese otro correo."
          );
        } else if (error.response.data.message === "UsuarioExistente") {
          toast.error(
            "El usuario ya está registrado. Por favor, elija otro nombre de usuario."
          );
        } else {
          toast.error(
            "Nombre de usuario y correo electrónico ya registrados. Por favor, ingrese datos diferentes."
          );
        }
      } else {
        console.error("Error al registrar el administrador:", error.message);
        toast.error("Error al registrar el administrador.");
      }
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />

      <Form className="login-form" onSubmit={handleSubmit}>
        <h2 className="mb-4">Registro de Administrador</h2>
        <Form.Group controlId="username">
          <Form.Label>Nombre de usuario</Form.Label>
          <Form.Control
            type="text"
            name="user"
            value={formData.user}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="pass"
            value={formData.pass}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <div className="validation-errors">
          {validationErrors.map((error, index) => (
            <p key={index} className="error-message">
              {error.msg}
            </p>
          ))}
        </div>
        <div className="login-buttons">
          <Button variant="custom" type="submit" className="btn-custom">
            Registrarse
          </Button>
          <Button
            variant="custom"
            className="btn-custom"
            onClick={() => navigate("/Login")}
          >
            Volver
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default AdminRegistration;
