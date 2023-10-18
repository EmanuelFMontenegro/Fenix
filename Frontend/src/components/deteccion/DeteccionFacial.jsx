import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Modal, Box, Typography, Button } from "@mui/material";

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
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/weights");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/weights");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/weights");
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/weights");
      setModelsLoaded(true);
    };

    loadModels();
  }, []);

  useEffect(() => {
    const startCameraAutomatically = async () => {
      try {
        const video = videoRef.current;
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;

        video.addEventListener("loadedmetadata", () => {
          const displaySize = {
            width: video.videoWidth,
            height: video.videoHeight,
          };

          const canvas = faceapi.createCanvasFromMedia(video);
          document.body.append(canvas);
          const context = canvas.getContext("2d");

          faceapi.matchDimensions(canvas, displaySize);

          const detect = async () => {
            try {
              const newDetections = await faceapi
                .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptors();

              context.clearRect(0, 0, canvas.width, canvas.height);

              newDetections.forEach(async (detection) => {
                const { x, y, width, height } = detection.detection.box;
                const landmarks = detection.landmarks._positions;

                context.strokeStyle = "blue";
                context.lineWidth = 2;
                context.strokeRect(x, y, width, height);

                context.fillStyle = "blue";
                landmarks.forEach((point) => {
                  context.beginPath();
                  context.arc(point.x, point.y, 2, 0, Math.PI * 2);
                  context.fill();
                });
              });

              requestAnimationFrame(detect);
            } catch (error) {
              console.error(error);
            }
          };

          detect();
        });
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
      }
    };

    startCameraAutomatically();
  }, []);

  const captureImage = async () => {
    console.log("Capturing image...");
    try {
      const canvas = faceapi.createCanvasFromMedia(videoRef.current);
      const context = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const capturedImageData = canvas.toDataURL("image/jpeg", 0.6);

      if (capturedImageData.startsWith("data:image/jpeg;base64,")) {
        // Realizar reconocimiento facial
        const detections = await faceapi
          .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (detections.length === 1) {
          try {
            // Validar si el nombre y apellido ya existen
            const response = await axios.get(
              `http://localhost:4000/validate?nombre=${nombre}&apellido=${apellido}`
            );

            if (response.data.existe) {
              // Si existe, actualiza los estados de nombre y apellido y muestra el modal
              setNombre(response.data.nombre);
              setApellido(response.data.apellido);
              setShowRegistroExistenteModal(true);
              return;
            } else {
              // Si no existe, enviar la información al servidor
              const descriptor1 = detections[0].descriptor[0];
              const descriptor2 = detections[0].descriptor[1];
              console.log("Descriptores:", descriptor1, descriptor2);

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
            console.error("Error al enviar los datos al servidor:", error);
          }
        } else if (detections.length > 1) {
          console.error(
            "Se detectaron múltiples rostros. Debe haber solo uno."
          );
          // Agregar lógica para mostrar mensaje al usuario o desactivar botón de registro
        } else {
          console.error(
            "No se detectó ningún rostro. Ajuste la cámara o su posición."
          );
          // Agregar lógica para mostrar mensaje al usuario o desactivar botón de registro
        }
      } else {
        console.error(
          "Error al capturar la imagen: Formato de imagen incorrecto"
        );
      }
    } catch (error) {
      console.error("Error al capturar la imagen:", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div>
        <video id="video" autoPlay muted ref={videoRef} />
        <canvas
          style={{ position: "absolute", top: 0, left: 0 }}
          ref={canvasRef}
        />
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
                color: "#4169e1", // Cambié el color del texto al tono de azul más fuerte
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
                color: "#4169e1", // Cambié el color del texto al tono de azul más fuerte
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
              fontFamily: "5px", // Cambié el color del texto del botón a aqua
              backgroundColor: "blue", // Cambié el color de fondo del botón al tono de azul más fuerte
              borderColor: "#4169e1", // Cambié el color del borde del botón al tono de azul más fuerte
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
            left: "50%", // Cambié el valor de left
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
    </div>
  );
};

export default DeteccionFacial;
