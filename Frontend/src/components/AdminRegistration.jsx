import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorModal from './ErrorModal';
import '../styles/AdminRegistration.css';

function AdminRegistration() {
  const [formData, setFormData] = useState({
    user: '',    // Cambiado de "username" a "user"
    pass: '',    // Cambiado de "password" a "pass"
    correo: '',  // Cambiado de "email" a "correo"
  });

  const [validationErrors, setValidationErrors] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  const handleRegistrationSuccessClose = () => {
    setRegistrationSuccess(false);
    navigate('/Login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors([]);
    // console.log('Datos del formulario:', formData);

    try {
      if (
        formData.user.trim() !== '' &&
        formData.pass.trim() !== '' &&
        formData.correo.trim() !== ''
      ) {
        const response = await axios.post('http://localhost:4000/signup', formData);

        if (response.data.success) {
          setRegistrationSuccess(true);

          setTimeout(() => {
            navigate('/Login');
          }, 2000);
        } else {
          if (response.data.message === 'El correo electrónico ya está en uso') {
            alert('El correo electrónico ya está en uso. Por favor, ingrese otro correo.');
          } else {
            setShowErrorModal(true);
            setValidationErrors(response.data.errors || []);
          }
        }
      } else {
        console.error('Por favor, complete todos los campos.');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setShowErrorModal(true);
        setValidationErrors(error.response.data.errors || []);
      } else {
        console.error('Error al registrar el administrador:', error.message);
      }
    }
  };

  const navigate = useNavigate();

  return (
    <div className="login-container">
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
          <Button variant="custom" className="btn-custom" onClick={() => navigate('/Login')}>
            Volver
          </Button>
        </div>
      </Form>

      <Modal show={registrationSuccess} onHide={handleRegistrationSuccessClose}>
        <Modal.Header closeButton>
          <Modal.Title>Registro Exitoso</Modal.Title>
        </Modal.Header>
        <Modal.Body>Registro exitoso. Redirigiendo...</Modal.Body>
      </Modal>

      <ErrorModal
        show={showErrorModal}
        handleClose={handleCloseErrorModal}
        errorMessage="El nombre de usuario o el email ya están en uso"
      />
    </div>
  );
}

export default AdminRegistration;