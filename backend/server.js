const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs").promises;
const canvas = require("canvas");
const faceapi = require("face-api.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  findUserByUser,
  updateUserPass,
  registerAdmin,
  handleForgotPasswordRequest,
} = require("./routes/authController");
const cors = require("cors");
const { Canvas, Image, ImageData } = canvas;
const db = require("./db");
const secretKey = "tu-clave-secreta";
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 4000;
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const allowedOrigins = ["http://localhost:5173"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Acceso no permitido por CORS"));
      }
    },
  })
);

app.use(express.static(path.join(__dirname, "build")));
app.use("/weights", express.static("weights"));

app.post("/detect", async (req, res) => {
  console.log("Solicitud POST recibida en /detect");
  try {
    const { imageBlob, nombre, apellido, descriptors } = req.body;

    console.log("Datos recibidos:", {
      imageBlob,
      nombre,
      apellido,
      descriptors,
    });

    const existingRecord = await checkExistingRecord(nombre, apellido);

    if (existingRecord) {
      return res.status(400).json({ error: "Usuario registrado" });
    }

    // const existingDescriptor = await verificarDescriptor(descriptors);

    // if (existingDescriptor) {
    //   return res.status(400).json({ error: "Rostro Existente en BD" });
    // }

    const imageName = `captura_${Date.now()}.png`;

    const imageData = imageBlob.split("base64,")[1];
    const imageBuffer = Buffer.from(imageData, "base64");

    await fs.writeFile(
      path.join(__dirname, "capturas", imageName),
      imageBuffer
    );

    const sql =
      "INSERT INTO rostros (nombre, apellido, imagen_rostro, descriptors) VALUES (?, ?, ?, ?)";
    const values = [nombre, apellido, imageName, JSON.stringify(descriptors)];

    await db.query(sql, values);
    res.json({ imageName });
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    res.status(500).json({ error: "Error al procesar la imagen" });
  }
});

async function checkExistingRecord(nombre, apellido) {
  const sql = "SELECT * FROM rostros WHERE nombre = ? AND apellido = ?";
  const [rows] = await db.query(sql, [nombre, apellido]);
  return rows.length > 0;
}

app.post("/obtenerDescriptores", async (req, res) => {
  try {
    const descriptorRecibido = JSON.parse(req.body.descriptor);
    const resultado = await verificarDescriptor(descriptorRecibido);
    res.json(resultado);
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

async function verificarDescriptor(descriptorRecibido) {
  const sql = "SELECT * FROM rostros";
  const [results] = await db.query(sql);

  for (const row of results) {
    const descriptorBD = JSON.parse(row.descriptors);

    const distance = faceapi.euclideanDistance(
      descriptorRecibido,
      descriptorBD
    );

    if (distance < 0.6) {
      return {
        match: true,
        nombre: row.nombre,
        apellido: row.apellido,
      };
    }
  }
  return { match: false };
}

app.get("/validate", async (req, res) => {
  try {
    const { nombre, apellido } = req.query;
    const existingRecord = await checkExistingRecord(nombre, apellido);
    res.json({ existe: existingRecord });
  } catch (error) {
    console.error("Error al verificar el registro:", error);
    res.status(500).json({ error: "Error al verificar el registro" });
  }
});

app.get("/capturas", async (req, res) => {
  try {
    const files = await fs.readdir(path.join(__dirname, "capturas"));
    const nombres = files.map((file) => path.parse(file).name);
    res.json({ nombres });
  } catch (error) {
    console.error("Error al obtener nombres de capturas:", error);
    res.status(500).json({ error: "Error al obtener nombres de capturas" });
  }
});
function requireAuth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Acceso no autorizado" });
  } else {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Acceso no autorizado" });
      } else {
        req.user = decoded;
        next();
      }
    });
  }
}


app.post("/signup", async (req, res) => {
  try {
    const { user, pass, correo } = req.body;
    const response = await registerAdmin(user, pass, correo);
    res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});


app.post("/login", async (req, res) => {
  try {
    const { user, pass } = req.body;
    const usuario = await findUserByUser(user);

    if (!usuario) {
      console.log("Usuario no encontrado en la base de datos");
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado en la base de datos",
      });
    }

    const ispassValid = await bcrypt.compare(pass, usuario.pass);

    if (!ispassValid) {
      console.log("Contraseña incorrecta");
      return res
        .status(401)
        .json({ success: false, message: "Contraseña incorrecta" });
    }

    // Generar token JWT (Paso 6)
    const token = jwt.sign({ user: usuario.user }, "tu-clave-secreta", {
      expiresIn: "1h",
    });

    res
      .status(200)
      .json({ success: true, message: "Inicio de sesión exitoso", token });
    console.log("Inicio de sesión exitoso. Token generado:", token);
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});

app.post("/forgot-pass", async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res
      .status(400)
      .json({ success: false, message: "El correo no fue proporcionado" });
  }

  const user = await findUserByCorreo(correo);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "El correo proporcionado no está registrado",
    });
  }

 
  const pass = "nueva_contraseña"; 

  const response = await handleForgotPasswordRequest(correo, pass);
  res.status(response.success ? 200 : 400).json(response);
});

app.post("/resetpass", async (req, res) => {
  const { correo, pass } = req.body; 

  if (!correo || !pass) {
    return res.status(400).json({
      success: false,
      message: "Correo o nueva contraseña no proporcionados",
    });
  }

  const user = await findUserByCorreo(correo);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "El correo proporcionado no está registrado",
    });
  }

  const hashedpass = await bcrypt.hash(pass, 10);
  const updateSuccess = await updateUserPass(correo, hashedpass);

  if (updateSuccess) {
    res
      .status(200)
      .json({ success: true, message: "Contraseña cambiada con éxito" });
  } else {
    res
      .status(500)
      .json({ success: false, message: "Error al cambiar la contraseña" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build"));
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
