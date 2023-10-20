const express = require('express');
const router = express.Router();
const { updateUserPass } = require('../routes/authController');

// Ruta para cambiar la contraseña
router.put('/resetpass', async (req, res) => {
  const { correo, pass } = req.body;

  if (!correo || !pass) {
    return res.status(400).json({ success: false, message: 'Correo o nueva contraseña no proporcionados' });
  }

  const updateSuccess = await updateUserPass(correo, pass);

  if (updateSuccess) {
    return res.status(200).json({ success: true, message: 'Contraseña cambiada con éxito' });
  } else {
    return res.status(500).json({ success: false, message: 'Error al cambiar la contraseña' });
  }
});

module.exports = router;
