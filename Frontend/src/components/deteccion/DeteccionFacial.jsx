import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Modal, Box, Typography, Button } from "@mui/material";
import "./style.scss";

const DeteccionFacial = () => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [buttonColor, setButtonColor] = useState("primary");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showRegistroExistenteModal, setShowRegistroExistenteModal] =
    useState(false);
  const [error, setError] = useState(null);

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const handleModalClose = () => {
    setShowRegistroExistenteModal(false);
    setNombre("");
    setApellido("");
  };

  useEffect(() => {
    if (showSnackbar) {
      setTimeout(() => {
        setShowSnackbar(false);
      }, 5000);
    }
  }, [showSnackbar]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
  }, [videoRef, canvasRef]);

  const cargarCamera = () => {
    const elVideo = videoRef.current;

    navigator.getMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    navigator.getMedia(
      {
        video: { width: 640, height: 480 },
        audio: false,
      },
      (stream) => (elVideo.srcObject = stream),
      console.error
    );
  };

  useEffect(() => {
    cargarCamera();

    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/weights"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/weights"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/weights"),
      faceapi.nets.ageGenderNet.loadFromUri("/weights"),
      faceapi.nets.faceExpressionNet.loadFromUri("/weights"),
    ])
      .then(() => {
        setModelsLoaded(true);
        console.log("Modelos cargados correctamente");
      })
      .catch((error) => {
        setError("Error al cargar los modelos. Por favor, inténtalo de nuevo.");
        console.error("Error al cargar los modelos:", error);
      });
  }, []);
  const getDominantEmotion = (expressions) => {
    if (expressions) {
      const emotionEntries = Object.entries(expressions);
      if (emotionEntries.length > 0) {
        const dominantEmotion = emotionEntries.reduce(
          (prev, current) => (current[1] > prev[1] ? current : prev),
          emotionEntries[0]
        );
        return dominantEmotion[0];
      }
    }
    return "Desconocido";
  };

  useEffect(() => {
    const detect = async () => {
      try {
        const newDetections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceDescriptors()
          .withAgeAndGender()
          .withFaceExpressions();

        console.log("Rostros detectados:", newDetections);

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        context.clearRect(0, 0, canvas.width, canvas.height);

        newDetections.forEach(async (detection) => {
          const box = detection.detection.box;
          if (box) {
            const { x, y, width, height } = box;
            const landmarks = detection.landmarks._positions;

            context.strokeStyle = "yellow";
            context.lineWidth = 2;
            context.strokeRect(x, y, width, height);

            context.fillStyle = "white";
            landmarks.forEach((point) => {
              context.beginPath();
              context.arc(point.x + 20, point.y, 1.5, 0, Math.PI * 2); // Suma 1 a la coordenada x
              context.fill();
            });

            context.font = "12px Arial";
            context.fillStyle = "yellow";
            context.fillText(
              `Edad: ${Math.round(detection.age || 0)} años`,
              x,
              y - 10
            );
            context.fillText(
              `Género: ${detection.gender || "Desconocido"}`,
              x,
              y - 30
            );
            context.fillText(
              `Emociones: ${getDominantEmotion(detection.expressions)}`,
              x,
              y - 50
            );
          }
        });
      } catch (error) {
        setError(
          "Error en la detección de rostros. Por favor, inténtalo de nuevo."
        );
        console.error("Error en la detección de rostros:", error);
      }
    };

    if (modelsLoaded) {
      const interval = setInterval(detect, 50);
      return () => clearInterval(interval);
    }
  }, [modelsLoaded]);

  const captureImage = async () => {
    console.log("Capturing image...");
    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const capturedImageData = canvas.toDataURL("image/jpeg", 0.6);

      console.log("Datos de la imagen capturada:", capturedImageData);

      if (capturedImageData.startsWith("data:image/jpeg;base64,")) {
        const detections = await faceapi
          .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors()
          .withAgeAndGender()
          .withFaceExpressions();

        console.log("Datos de detección:", detections);

        if (detections.length === 1) {
          try {
            const response = await axios.get(
              `http://localhost:4000/validate?nombre=${nombre}&apellido=${apellido}`
            );

            if (response.data.existe) {
              setNombre(response.data.nombre);
              setApellido(response.data.apellido);
              setShowRegistroExistenteModal(true);
              return;
            } else {
              const descriptor1 = detections[0].descriptor[0];
              const descriptor2 = detections[0].descriptor[1];

              const registroResponse = await axios.post(
                "http://localhost:4000/detect",
                {
                  nombre,
                  apellido,
                  imageBlob: capturedImageData,
                  descriptor1,
                  descriptor2,
                }
              );

              console.log(registroResponse.data);
              setButtonColor("success");
              setShowSnackbar(true);
            }
          } catch (error) {
            setError(
              "Error al enviar los datos al servidor. Por favor, inténtalo de nuevo."
            );
            console.error("Error al enviar los datos al servidor:", error);
          }
        } else if (detections.length > 1) {
          setError("Se detectaron múltiples rostros. Debe haber solo uno.");
          console.error(
            "Se detectaron múltiples rostros. Debe haber solo uno."
          );
        } else {
          setError(
            "No se detectó ningún rostro. Ajuste la cámara o su posición."
          );
          console.error(
            "No se detectó ningún rostro. Ajuste la cámara o su posición."
          );
        }
      } else {
        setError("Error al capturar la imagen: Formato de imagen incorrecto.");
        console.error(
          "Error al capturar la imagen: Formato de imagen incorrecto."
        );
      }
    } catch (error) {
      setError("Error al capturar la imagen. Por favor, inténtalo de nuevo.");
      console.error("Error al capturar la imagen:", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div className="container">
        <video id="video" autoPlay muted ref={videoRef} />
        <canvas ref={canvasRef} className="overlay-canvas" />
      </div>

      <div
        style={{
          marginLeft: "10px",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="mt-3">
          <label>
            Nombre:
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="form-control"
              style={{
                border: "2px solid aqua",
                borderRadius: "4px",
                color: "#4169e1",
              }}
            />
          </label>
          <br />
          <label>
            Apellido:
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="form-control"
              style={{
                border: "2px solid aqua",
                borderRadius: "4px",
                color: "#4169e1",
              }}
            />
          </label>

          <br />
          <button
            type="button"
            className={`btn btn-${buttonColor}`}
            onClick={captureImage}
            disabled={!modelsLoaded || !nombre || !apellido}
            style={{
              marginTop: "15px",
              color: "white",
              fontFamily: "5px",
              backgroundColor: "blue",
              borderColor: "#4169e1",
            }}
          >
            Registro Facial
          </button>
        </div>
      </div>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert elevation={6} variant="filled" severity="warning">
          ¡Empleado registrado Gracias!
        </MuiAlert>
      </Snackbar>
      <Modal
        open={showRegistroExistenteModal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxWidth: 400,
            width: "80%",
          }}
        >
          <Typography variant="h6" component="h2" sx={{ color: "green" }}>
            Ya se encuentra registrado el empleado !!!
          </Typography>
          <Button
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
            onClick={handleModalClose}
          >
            Cerrar
          </Button>
        </Box>
      </Modal>
      <Snackbar
        open={error !== null}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert elevation={6} variant="filled" severity="error">
          {error}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default DeteccionFacial;
