// forgotPasswordRoute.js
const express = require('express');
const router = express.Router();
const { handleForgotPasswordRequest } = require('./authController');

router.post('/forgot-password', async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      console.log('El correo no fue proporcionado');
      return res.status(400).json({ success: false, message: 'El correo no fue proporcionado' });
    }

    console.log('Correo recibido:', correo); // Registro del correo recibido

    const result = await handleForgotPasswordRequest(correo);

    console.log('Result from handleForgotPasswordRequest:', result);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error en forgot-password:', error);
    res.status(500).json({ success: false, message: 'Error en forgot-password' });
  }
});

module.exports = router;
