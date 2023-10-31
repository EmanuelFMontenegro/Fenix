const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs").promises;
const canvas = require("canvas");
const faceapi = require("face-api.js");
const cors = require("cors");
const { Canvas, Image, ImageData } = canvas;
const db = require("./db");

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

    const existingDescriptor = await verificarDescriptor(descriptors);

    if (existingDescriptor) {
      return res.status(400).json({ error: "Rostro Existente en BD" });
    }

    const imageName = `captura_${Date.now()}.png`;

    const imageData = imageBlob.split("base64,")[1];
    const imageBuffer = Buffer.from(imageData, "base64");

    await fs.writeFile(
      path.join(__dirname, "capturas", imageName),
      imageBuffer
    );

    const sql =
      "INSERT INTO rostros (nombre, apellido, imagen_rostro, descriptors) VALUES (?, ?, ?, ?)";
    const values = [
      nombre,
      apellido,
      imageName,
      JSON.stringify(descriptors), // Guardamos los descriptores como una cadena JSON
    ];

    db.query(sql, values, (err, result) => {
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

async function checkExistingRecord(nombre, apellido) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM rostros WHERE nombre = ? AND apellido = ?";
    const values = [nombre, apellido];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error al buscar en la base de datos:", err);
        reject(err);
      } else {
        resolve(result.length > 0);
      }
    });
  });
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
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM rostros";

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error al obtener descriptores:", err);
        reject({ error: "Error al obtener descriptores" });
      } else {
        for (const row of results) {
          const descriptorBD = JSON.parse(row.descriptors);

          const distance = faceapi.euclideanDistance(
            descriptorRecibido,
            descriptorBD
          );

          if (distance < 0.6) {
            resolve({
              match: true,
              nombre: row.nombre,
              apellido: row.apellido,
            });
            return;
          }
        }
        resolve({ match: false });
      }
    });
  });
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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build"));
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
