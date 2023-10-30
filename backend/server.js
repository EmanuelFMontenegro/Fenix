const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByUser, updateUserPass, registerAdmin, handleForgotPasswordRequest } = require('./routes/authController');
const app = express();
const mysql = require('mysql2/promise');
const PORT = process.env.PORT || 4000;

const secretKey = 'tu-clave-secreta'; 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowedOrigins = ["http://localhost:5173"];

const corsOptions = {
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

app.post("/detect", async (req, res) => {
  console.log("Solicitud POST recibida en /detect");
  try {
    const { imageBlob, nombre, apellido, descriptor1, descriptor2 } = req.body;

    console.log("Datos recibidos:", {
      imageBlob,
      nombre,
      apellido,
      descriptor1,
      descriptor2,
    });

    const existingRecord = await checkExistingRecord(nombre, apellido);

    if (existingRecord) {
      return res.status(400).json({ error: "Usuario registrado" });
    }

    const imageName = `captura_${Date.now()}.png`;


    const imageData = imageBlob.split("base64,")[1];
    const imageBuffer = Buffer.from(imageData, "base64");

    await fs.writeFile(
      path.join(__dirname, "capturas", imageName),
      imageBuffer
    );

    const sql =
      "INSERT INTO rostros (nombre, apellido, imagen_rostro, descriptor1, descriptor2) VALUES (?, ?, ?, ?, ?)";
    const values = [
      nombre,
      apellido,
      imageName,
      JSON.stringify(descriptor1),
      JSON.stringify(descriptor2),
    ];

    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error al guardar en la base de datos:", err);
        res.status(500).json({ error: "Error al guardar en la base de datos" });
      } else {
        res.json({ imageName });
      }
    });
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    res.status(500).json({ error: "Error al procesar la imagen" });
  }
});

app.get("/validate", async (req, res) => {
  try {
    const { nombre, apellido } = req.query;
    const existingRecord = await checkExistingRecord(nombre, apellido);
    res.json({ existe: existingRecord });
  } catch (error) {
    console.error("Error al verificar el registro:", error);
    res.status(500).json({ error: "Error al verificar el registro" });
  }
});
async function checkExistingRecord(nombre, apellido) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM rostros WHERE nombre = ? AND apellido = ?";
    const values = [nombre, apellido];

    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error al buscar en la base de datos:", err);
        reject(err);
      } else {
        resolve(result.length > 0);
      }
    });
  });
}








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

const forgotPasswordRoutes = require('./routes/forgotPasswordRoute'); 
app.use('/forgot-password', forgotPasswordRoutes);


app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
// const routesEmpleados = require('./routes/routesEmpleados'); // Importa el enrutador de empleados

const pool = require('./db'); // Importa el pool de conexiones
// app.use('/empleados', routesEmpleados);
const routesEmpleados = require('./routes/routesEmpleados'); // Importa el enrutador de empleados
app.use('/empleados', routesEmpleados); // Usa el enrutador de empleados para las rutas /empleados