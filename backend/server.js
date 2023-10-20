// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const fs = require("fs").promises;
// const canvas = require("canvas");
// const faceapi = require("face-api.js");
// const cors = require("cors");
// const { Canvas, Image, ImageData } = canvas;
// const db = require("./db"); // Asegúrate de que db.js configure correctamente la conexión a la base de datos

// faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// const app = express();
// const PORT = process.env.PORT || 4000;

// app.use(bodyParser.json({ limit: "10mb" }));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());

// const allowedOrigins = ["http://localhost:5173"];
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Acceso no permitido por CORS"));
//       }
//     },
//   })
// );

// app.use(express.static(path.join(__dirname, "build")));

// app.post("/detect", async (req, res) => {
//   console.log("Solicitud POST recibida en /detect");
//   try {
//     const { imageBlob, nombre, apellido, descriptor1, descriptor2 } = req.body;

//     console.log("Datos recibidos:", {
//       imageBlob,
//       nombre,
//       apellido,
//       descriptor1,
//       descriptor2,
//     });

//     const existingRecord = await checkExistingRecord(nombre, apellido);

//     if (existingRecord) {
//       return res.status(400).json({ error: "Usuario registrado" });
//     }

//     const imageName = `captura_${Date.now()}.png`;

//     const imageData = imageBlob.split("base64,")[1];
//     const imageBuffer = Buffer.from(imageData, "base64");

//     await fs.writeFile(
//       path.join(__dirname, "capturas", imageName),
//       imageBuffer
//     );

//     const sql =
//       "INSERT INTO rostros (nombre, apellido, imagen_rostro, descriptor1, descriptor2) VALUES (?, ?, ?, ?, ?)";
//     const values = [
//       nombre,
//       apellido,
//       imageName,
//       JSON.stringify(descriptor1),
//       JSON.stringify(descriptor2),
//     ];

//     db.query(sql, values, (err, result) => {
//       if (err) {
//         console.error("Error al guardar en la base de datos:", err);
//         res.status(500).json({ error: "Error al guardar en la base de datos" });
//       } else {
//         res.json({ imageName });
//       }
//     });
//   } catch (error) {
//     console.error("Error al procesar la imagen:", error);
//     res.status(500).json({ error: "Error al procesar la imagen" });
//   }
// });

// app.post("/recognize-face", async (req, res) => {
//   console.log("Solicitud POST recibida en /recognize-face");
//   try {
//     const { descriptor1, descriptor2 } = req.body;

//     console.log("Descriptores recibidos:", { descriptor1, descriptor2 });

//     const existingRecord = await checkExistingDescriptors(
//       descriptor1,
//       descriptor2
//     );

//     res.json({ existe: existingRecord });
//   } catch (error) {
//     console.error("Error al procesar los descriptores:", error);
//     res.status(500).json({ error: "Error al procesar los descriptores" });
//   }
// });

// async function checkExistingDescriptors(descriptor1, descriptor2) {
//   return new Promise((resolve, reject) => {
//     const sql =
//       "SELECT * FROM rostros WHERE descriptor1 = ? AND descriptor2 = ?";
//     const values = [JSON.stringify(descriptor1), JSON.stringify(descriptor2)];

//     db.query(sql, values, (err, result) => {
//       if (err) {
//         console.error("Error al buscar en la base de datos:", err);
//         reject(err);
//       } else {
//         resolve(result.length > 0);
//       }
//     });
//   });
// }

// app.get("/validate", async (req, res) => {
//   try {
//     const { nombre, apellido } = req.query;
//     const existingRecord = await checkExistingRecord(nombre, apellido);
//     res.json({ existe: existingRecord });
//   } catch (error) {
//     console.error("Error al verificar el registro:", error);
//     res.status(500).json({ error: "Error al verificar el registro" });
//   }
// });

// app.post("/check-face", async (req, res) => {
//   console.log("Solicitud POST recibida en /check-face");
//   try {
//     const { imageBlob } = req.body;
//     const response = await axios.get(`data:image/jpeg;base64,${imageBlob}`, {
//       responseType: "arraybuffer",
//     });
//     const image = await canvas.loadImage(Buffer.from(response.data));
//     const detections = await faceapi
//       .detectSingleFace(
//         image,
//         new faceapi.TinyFaceDetectorOptions({ inputSize: 512 })
//       )
//       .withFaceLandmarks()
//       .withFaceDescriptor();

//     if (detections) {
//       res.json({ existe: true });
//     } else {
//       res.json({ existe: false });
//     }
//   } catch (error) {
//     console.error("Error al procesar la imagen:", error);
//     res.status(500).json({ error: "Error al procesar la imagen" });
//   }
// });

// async function checkExistingRecord(nombre, apellido) {
//   return new Promise((resolve, reject) => {
//     const sql = "SELECT * FROM rostros WHERE nombre = ? AND apellido = ?";
//     const values = [nombre, apellido];

//     db.query(sql, values, (err, result) => {
//       if (err) {
//         console.error("Error al buscar en la base de datos:", err);
//         reject(err);
//       } else {
//         resolve(result.length > 0);
//       }
//     });
//   });
// }

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

// app.listen(PORT, () => {
//   console.log(`Servidor iniciado en el puerto ${PORT}`);
// });


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
    res.status(response.success ? 200 : 400).json(response);
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
      return res.status(401).json({ success: false, message: 'Nombre de usuario o contraseña incorrectos' });
    }

    const ispassValid = await bcrypt.compare(pass, usuario.pass);

    if (!ispassValid) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ success: false, message: 'Nombre de usuario o contraseña incorrectos' });
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