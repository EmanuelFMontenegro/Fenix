import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CambioContrasena = () => {
  const [pass, setPass] = useState('');
  const location = useLocation();
  const resetToken = location.state.resetToken;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPass(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/resetpassword', {
        resetToken,
        newpass: pass,
      });

      if (response.data.success === true) {
        alert('Contraseña cambiada con éxito');
        navigate('/login');
      } else {
        console.error('Error al cambiar la contraseña:', response.data.message);
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  return (
    <div>
      <h2>Cambio de Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nueva Contraseña</label>
          <input type="password" value={pass} onChange={handleChange} />
        </div>
        <button type="submit">Cambiar Contraseña</button>
      </form>
    </div>
  );
};



export default CambioContrasena;
