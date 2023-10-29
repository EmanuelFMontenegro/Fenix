const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByUser, updateUserPass, registerAdmin, handleForgotPasswordRequest } = require('./routes/authController');
const app = express();
const mysql = require('mysql2/promise');
const PORT = process.env.PORT || 4000;

const secretKey = 'tu-clave-secreta'; // Definimos la clave secreta

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowedOrigins = ["http://localhost:5173"];

const corsOptions = {
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware de autenticación para verificar el token (Paso 3)
function requireAuth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Acceso no autorizado' });
  } else {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: 'Acceso no autorizado' });
      } else {
        req.user = decoded;
        next();
      }
    });
  }
}

// Ruta de registro (Paso 4)
app.post('/signup', async (req, res) => {
  try {
    const { user, pass, correo } = req.body;
    const response = await registerAdmin(user, pass, correo);
    if (response.message === 'UsuarioExistente' || response.message === 'CorreoExistente') {
      res.status(400).json(response);
    } else {
      res.status(response.success ? 200 : 400).json(response);
    }
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

// Ruta de inicio de sesión (Paso 5)
app.post('/login', async (req, res) => {
  try {
    const { user, pass } = req.body;
    const usuario = await findUserByUser(user);

    if (!usuario) {
      console.log('Usuario no encontrado en la base de datos');
      return res.status(401).json({ success: false, message: 'Usuario no encontrado en la base de datos' });
    }

    const ispassValid = await bcrypt.compare(pass, usuario.pass);

    if (!ispassValid) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }

    // Generar token JWT (Paso 6)
    const token = jwt.sign({ user: usuario.user }, 'tu-clave-secreta', { expiresIn: '1h' });
    
    res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', token });
    console.log('Inicio de sesión exitoso. Token generado:', token);
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

app.post('/forgot-pass', async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ success: false, message: 'El correo no fue proporcionado' });
  }

  const user = await findUserByCorreo(correo);

  if (!user) {
    return res.status(400).json({ success: false, message: 'El correo proporcionado no está registrado' });
  }

  // Definir 'pass' aquí o de donde corresponda
  const pass = 'nueva_contraseña';  // Cambia 'nueva_contraseña' por la contraseña deseada

  const response = await handleForgotPasswordRequest(correo, pass);
  res.status(response.success ? 200 : 400).json(response);
});

app.post('/resetpass', async (req, res) => {
  const { correo, pass } = req.body; // Definir 'pass' aquí

  if (!correo || !pass) {
    return res.status(400).json({ success: false, message: 'Correo o nueva contraseña no proporcionados' });
  }

  const user = await findUserByCorreo(correo);

  if (!user) {
    return res.status(400).json({ success: false, message: 'El correo proporcionado no está registrado' });
  }

  const hashedpass = await bcrypt.hash(pass, 10);
  const updateSuccess = await updateUserPass(correo, hashedpass);

  if (updateSuccess) {
    res.status(200).json({ success: true, message: 'Contraseña cambiada con éxito' });
  } else {
    res.status(500).json({ success: false, message: 'Error al cambiar la contraseña' });
  }
});
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});