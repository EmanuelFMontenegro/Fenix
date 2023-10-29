import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../styles/ForgotPassword.css'

function ForgotPassword() {
  const [formData, setFormData] = useState({
    correo: '',
    pass: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.correo.trim() !== '' && formData.pass.trim() !== '') {
        const response = await axios.post('/forgot-pass', {
          correo: formData.correo,
          pass: formData.pass, 
        });

        if (response.data.success === true) {
          console.log('Contraseña cambiada con éxito');
        } else {
          console.error('Error en la solicitud de recuperación de contraseña:', response.data.message);
        }
      } else {
        console.error('Por favor, complete todos los campos.');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  return (
    <div className="forgot-pass-container">
      <Form className="forgot-pass-form" onSubmit={handleSubmit}>
        <h2 className="mb-4">Recuperación de Contraseña</h2>
        <Form.Group controlId="correo">
          <Form.Label className="forgot-pass-label">Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
            required
            className="forgot-pass-input"
          />
        </Form.Group>
        <Form.Group controlId="pass">
          <Form.Label className="forgot-pass-label">Nueva Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="pass"
            value={formData.newpass}
            onChange={handleInputChange}
            required
            className="forgot-pass-input"
          />
        </Form.Group>
        <Button variant="custom" type="submit" className="btn-custom">
          Enviar
        </Button>
        <Button variant="custom" className="btn-custom" onClick={() => navigate('/Login')}>
          Volver
        </Button>
      </Form>
    </div>
  );
}

export default ForgotPassword;
