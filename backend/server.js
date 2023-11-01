const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const mysql = require('mysql2/promise');
const { findUserByUser } = require('../backend/routes/authController');
const {findUserByCorreo} = require('../backend/routes/authController')
const { updateUserPass } = require('../backend/routes/authController');
const {registerAdmin} = require('../backend/routes/authController')

const PORT = process.env.PORT || 4000;

const secretKey = 'tu-clave-secreta'; 

// Pool y configuración de la base de datos (podría variar dependiendo de tu caso)
const pool = require('../backend/db');

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
    return res.status(401).json({ success: false, message: 'Se requiere un token de autenticación' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'El token ha expirado' });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Token inválido' });
      } else {
        return res.status(401).json({ success: false, message: 'Acceso no autorizado' });
      }
    }

    
    req.user = decoded;
    next();
  });
}

// Ruta de registro (Paso 4)
app.post('/signup', async (req, res) => {
  console.log('Datos recibidos del formulario:', req.body);
  try {
    const { user, pass, correo } = req.body;
    const response = await registerAdmin(user, pass, correo);

     if (response.message === 'UsuarioExistente') {
      res.status(400).json(response);
    } else if (response.message === 'CorreoExistente') {
      res.status(400).json(response);
    } else {
      if (response.message === 'UsuarioExistente' || response.message === 'CorreoExistente') {
      res.status(400).json(response);
    } else {
      res.status(response.success ? 200 : 400).json(response);
    }
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

// Ruta para verificar el correo
app.post('/check-email', async (req, res) => {
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

app.post('/forgot-password', async (req, res) => {
  try {
    const { correo, pass } = req.body;

    const user = await findUserByCorreo(correo);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const updateResult = await updateUserPass(correo, pass);

    if (updateResult.success) {
      res.status(200).json({ success: true, message: 'Contraseña cambiada correctamente' });
    } else {
      res.status(400).json({ success: false, message: 'No se pudo cambiar la contraseña' });
    }
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al cambiar la contraseña' });
  }
});



app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});