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
app.post("/asistencia", async (req, res) => {
  try {
    const { nombre, apellido, descriptor1, descriptor2 } = req.query;

    // Busca en la base de datos un rostro con el nombre y apellido proporcionados
    const [rostro] = await connection
      .execute("SELECT * FROM rostros WHERE nombre = ? AND apellido = ?", [
        nombre,
        apellido,
      ])
      .catch((error) => {
        console.error("Error en la consulta de la base de datos:", error);
      });

    if (rostro && rostro.length > 0) {
      // Si se encontró un rostro con el nombre y apellido proporcionados,
      // compara los descriptores faciales
      const distancia1 = faceapi.euclideanDistance(
        new Float32Array(JSON.parse(rostro[0].descriptor1)),
        new Float32Array(descriptor1)
      );

      const distancia2 = faceapi.euclideanDistance(
        new Float32Array(JSON.parse(rostro[0].descriptor2)),
        new Float32Array(descriptor2)
      );

      // Establece un umbral para determinar si los rostros son suficientemente similares
      const umbral = 0.6;

      if (distancia1 < umbral && distancia2 < umbral) {
        // Si ambas distancias son menores que el umbral, consideramos que el rostro es válido
        res.json({
          existe: true,
          nombre: rostro[0].nombre,
          apellido: rostro[0].apellido,
        });
      } else {
        // Si alguna de las distancias es mayor que el umbral, el rostro no es suficientemente similar
        res.json({ existe: false });
      }
    } else {
      // Si no se encontró un rostro con el nombre y apellido proporcionados
      res.json({ existe: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
