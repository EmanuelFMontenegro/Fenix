const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/check-email', async (req, res) => {
  const { correo } = req.body;

  try {
    const [existingEmail] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

    if (existingEmail.length > 0) {
      return res.status(200).json({ exists: true, message: 'Operación exitosa' });
    } else {
      return res.status(200).json({ exists: false, message: 'Correo no registrado' });
    }
  } catch (error) {
    console.error('Error al verificar el correo:', error);
    return res.status(500).json({ exists: false, message: 'Error interno del servidor' });
  }
});

module.exports = router;