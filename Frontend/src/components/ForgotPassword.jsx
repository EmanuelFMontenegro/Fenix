import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ForgotPassword.css';

const instance = axios.create({
  baseURL: 'http://localhost:4000/'
});

function ForgotPassword() {
  const [formData, setFormData] = useState({
    correo: '',
    pass: '',
  });

  const [correoValidado, setCorreoValidado] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCorreoValidation = async (e) => {
    e.preventDefault();
    try {
      const response = await checkEmailExists(formData.correo);
      if (response.exists) {
        setCorreoValidado(true);
      }
    } catch (error) {
      console.error('Error al validar el correo:', error);
    }
  };

  const checkEmailExists = async (correo) => {
    try {
      const response = await instance.post('/check-email', { correo });
      return response.data;
    } catch (error) {
      console.error('Error al verificar el correo:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (correoValidado) {
        const response = await instance.post('/forgot-password', {
          correo: formData.correo,
          pass: formData.pass,
        });

        if (response.data.success === true) {
          toast.success(response.data.message);
          setTimeout(() => navigate('/login'), 2000);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);

      if (error.response && error.response.status === 400) {
        toast.success('Contraseña cambiada correctamente');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error('Ocurrió un error al cambiar la contraseña.');
      }
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
        {!correoValidado ? (
          <Button variant="custom" type="button" className="btn-custom" onClick={handleCorreoValidation}>
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
            </div>
          </>
        )}
        <div className="d-flex justify-content-end">
          <Button variant="custom" className="btn-custom volver" onClick={() => navigate('/login')}>
            Volver
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ForgotPassword;
