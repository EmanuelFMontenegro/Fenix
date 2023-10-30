const express = require('express');
const router = express.Router();
const { findUserByCorreo, updateUserPass } = require('./userController'); 

router.post('/forgot-password', async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({ success: false, message: 'El correo no fue proporcionado' });
    }

    const user = await findUserByCorreo(correo);

    if (!user) {
      return res.status(400).json({ success: false, message: 'El correo proporcionado no está registrado' });
    }

    const nuevaContrasena = generarNuevaContrasena(); 

    const updateSuccess = await updateUserPass(correo, nuevaContrasena);

    if (updateSuccess) {
      res.status(200).json({ success: true, message: 'Contraseña cambiada con éxito' });
    } else {
      res.status(500).json({ success: false, message: 'Error al cambiar la contraseña' });
    }
  } catch (error) {
    console.error('Error en forgot-password:', error);
    res.status(500).json({ success: false, message: 'Error en forgot-password' });
  }
});

module.exports = router;