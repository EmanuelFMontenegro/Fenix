import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import "../../styles/Login.css";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


function Login() {
  const [showUserIncorrectModal, setShowUserIncorrectModal] = useState(false);
  const [showPassIncorrectModal, setShowPassIncorrectModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    user: '',
    pass: '',
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
  console.log('Credenciales de inicio de sesión:', formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.user.trim() !== '' && formData.pass.trim() !== '') {
        const userData = {
          user: formData.user,
          pass: formData.pass,
        };
  
        const response = await axios.post('http://localhost:4000/login', userData);
        console.log('response.data.success:', response.data.success);
        console.log('response.data.message:', response.data.message);
        
        if (response.data.success === true) {
          // Almacena el token de autenticación en localStorage
          localStorage.setItem('authToken', response.data.token);
          console.log('Mostrar modal de éxito');
          navigate('/Sidebar'); // Redirige al usuario a la página protegida
        } else if (response.data.message === 'Nombre de usuario incorrecto') {
          console.log('Mostrar modal de usuario incorrecto');
          setShowUserIncorrectModal(true);
        } else {
          console.log('Mostrar modal de contraseña incorrecta');
          setShowPassIncorrectModal(true);
        }
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  }
  
  
 

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
      
      <Modal show={showUserIncorrectModal} onHide={() => {setShowUserIncorrectModal(false);}}>
        <Modal.Header closeButton>
          <Modal.Title>Usuario incorrecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>El nombre de usuario es incorrecto. Por favor, inténtalo de nuevo.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserIncorrectModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showPassIncorrectModal} onHide={() => setShowPassIncorrectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Contraseña incorrecta</Modal.Title>
        </Modal.Header>
        <Modal.Body>La contraseña es incorrecta. Por favor, inténtalo de nuevo.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPassIncorrectModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
        <Modal.Title>Bienvenido/a</Modal.Title>
        </Modal.Header>
        <Modal.Body>Accediendo a Fenix</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserIncorrectModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

   
    </div>
  );
}

export default Login;