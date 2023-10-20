// const express = require('express');
// const router = express.Router();
// const { handleForgotPasswordRequest } = require('../routes/authController');

// // Ruta para cambiar la contraseña
// router.put('/resetpass', async (req, res) => {
//   const { correo, newpass } = req.body;

//   if (!correo || !newpass) {
//     return res.status(400).json({ success: false, message: 'Correo o nueva contraseña no proporcionados' });
//   }

//   const result = await handleForgotPasswordRequest(correo, newpass);

//   if (result.success) {
//     return res.status(200).json(result);
//   } else {
//     return res.status(500).json(result);
//   }
// });

// module.exports = router;
