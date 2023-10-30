import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ForgotPassword.css';

function ForgotPassword() {
  const [formData, setFormData] = useState({
    correo: '',
    pass: '',
  });

  const [correoValido, setCorreoValido] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const handleCorreoValidation = async () => {
    try {
      const response = await axios.post('/forgot-pass', {
        correo: formData.correo,
      });

      if (response.data.success === true) {
        console.log('El correo proporcionado está registrado');
        setCorreoValido(true);
      } else {
        console.error('Error en la validación de correo:', response.data.message);
      }
    } catch (error) {
      console.error('Error al validar el correo:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/resetpass', {
        correo: formData.correo,
        pass: formData.pass,
      });

      if (response.data.success === true) {
        console.log('Contraseña cambiada con éxito');
      } else {
        console.error('Error al cambiar la contraseña:', response.data.message);
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  return (
    <div className="forgot-pass-container">
      <Form className="forgot-pass-form">
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
        {!correoValido ? (
          <Button variant="custom" type="submit" className="btn-custom" onClick={handleCorreoValidation}>
            Validar Correo
          </Button>
        ) : (
          <>
            <Form.Group controlId="pass">
              <Form.Label className="forgot-pass-label">Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="pass"
                value={formData.pass}
                onChange={handleInputChange}
                required
                className="forgot-pass-input"
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
  <Button variant="custom" type="submit" className="btn-custom" onClick={handleSubmit}>
    Enviar
  </Button>
  <Button variant="custom" className="btn-custom volver" onClick={() => navigate('/Login')}>
    Volver
  </Button>
</div>
          </>
        )}
      </Form>
    </div>
  );
}

export default ForgotPassword;