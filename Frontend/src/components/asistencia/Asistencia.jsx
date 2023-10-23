import React, { useState, useEffect } from "react";
import { Button, Grid, Typography } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import * as faceapi from "face-api.js";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Asistencia = () => {
  const [deteccionCompletada, setDeteccionCompletada] = useState(false);
  const [entradaRegistrada, setEntradaRegistrada] = useState(false);
  const [salidaRegistrada, setSalidaRegistrada] = useState(false);

  useEffect(() => {
    const startCameraAutomatically = async () => {
      try {
        const video = document.getElementById("video");
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

              if (newDetections.length > 0) {
                const faceDescriptor = newDetections[0].descriptor;
                const response = await axios.post(
                  "http://localhost:4000/validate",
                  { faceDescriptor },
                  { headers: { "Content-Type": "application/json" } }
                );

                if (response.data.existe) {
                  toast.success("¡Rostro registrado!");
                  setEntradaRegistrada(false);
                  setSalidaRegistrada(false);
                } else {
                  toast.info("Rostro no registrado. ¿Deseas registrarlo?");
                }
              } else {
                setDeteccionCompletada(false);
              }

              newDetections.forEach(async (detection) => {
                const { x, y, width, height } = detection.detection.box;

                context.strokeStyle = "blue";
                context.lineWidth = 2;
                context.strokeRect(x, y, width, height);
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
  useEffect(() => {
    const loadModels = async () => {
      // Cargar los modelos necesarios
      await faceapi.nets.tinyFaceDetector.loadFromUri("/weights");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/weights");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/weights");

      // Empezar la detección una vez que los modelos estén cargados
      startCameraAutomatically();
    };

    loadModels();
  }, []);

  const handleEntradaClick = () => {
    // Lógica para registrar la entrada
    setEntradaRegistrada(true);
    console.log("Registro de entrada");
  };

  const handleSalidaClick = () => {
    // Lógica para registrar la salida
    setSalidaRegistrada(true);
    console.log("Registro de salida");
  };

  const handleRostroDetectado = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/validate?nombre=${nombre}&apellido=${apellido}`
      );

      if (response.data.existe) {
        // Si el rostro ya está registrado
        toast.success("¡Rostro registrado!");
        setEntradaRegistrada(false);
        setSalidaRegistrada(false);
      } else {
        // Si el rostro no está registrado
        toast.info("Rostro no registrado. ¿Deseas registrarlo?");
      }
    } catch (error) {
      toast.error(
        "Se perdió la conexión con el servidor. Por favor, inténtalo de nuevo."
      );
      console.error("Error al enviar los datos al servidor:", error);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Calendario de Asistencia</Typography>
      </Grid>
      <Grid item xs={12}>
        <CalendarTodayIcon fontSize="large" />
      </Grid>
      <Grid item xs={12}>
        <video id="video" autoPlay muted style={{ maxWidth: "100%" }} />
      </Grid>
      <Grid item xs={12}>
        {deteccionCompletada ? (
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEntradaClick}
              disabled={entradaRegistrada}
            >
              Entrada
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#4caf50", color: "white" }}
              onClick={handleSalidaClick}
              disabled={salidaRegistrada}
            >
              Salida
            </Button>
          </div>
        ) : (
          <Typography variant="body1">
            Por favor, espera mientras detectamos tu rostro...
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Asistencia;
