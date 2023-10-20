const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs").promises;
const canvas = require("canvas");
const faceapi = require("face-api.js");
const cors = require("cors");
const { Canvas, Image, ImageData } = canvas;
const db = require("./db"); // Asegúrate de que db.js configure correctamente la conexión a la base de datos

faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const app = express();
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

app.post("/recognize-face", async (req, res) => {
  console.log("Solicitud POST recibida en /recognize-face");
  try {
    const { descriptor1, descriptor2 } = req.body;

    console.log("Descriptores recibidos:", { descriptor1, descriptor2 });

    const existingRecord = await checkExistingDescriptors(
      descriptor1,
      descriptor2
    );

    res.json({ existe: existingRecord });
  } catch (error) {
    console.error("Error al procesar los descriptores:", error);
    res.status(500).json({ error: "Error al procesar los descriptores" });
  }
});

async function checkExistingDescriptors(descriptor1, descriptor2) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM rostros WHERE descriptor1 = ? AND descriptor2 = ?";
    const values = [JSON.stringify(descriptor1), JSON.stringify(descriptor2)];

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

app.post("/check-face", async (req, res) => {
  console.log("Solicitud POST recibida en /check-face");
  try {
    const { imageBlob } = req.body;
    const response = await axios.get(`data:image/jpeg;base64,${imageBlob}`, {
      responseType: "arraybuffer",
    });
    const image = await canvas.loadImage(Buffer.from(response.data));
    const detections = await faceapi
      .detectSingleFace(
        image,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 512 })
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detections) {
      res.json({ existe: true });
    } else {
      res.json({ existe: false });
    }
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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});



const routesEmpleados = require('./routes/routesEmpleados'); // Importa el enrutador de empleados

app.use('/empleados', routesEmpleados);