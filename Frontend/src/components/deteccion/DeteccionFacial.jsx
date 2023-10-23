import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, Box, Typography, Button } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./deteccion.scss";

const DeteccionFacial = () => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [buttonColor, setButtonColor] = useState("primary");
  const [showRegistroExistenteModal, setShowRegistroExistenteModal] =
    useState(false);
  const [error, setError] = useState(null);

  const handleModalClose = () => {
    setShowRegistroExistenteModal(false);
    setNombre("");
    setApellido("");
  };

  useEffect(() => {
    const cargarCamera = () => {
      const elVideo = videoRef.current;
      navigator.getMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      navigator.getMedia(
        {
          video: true,
          audio: false,
        },
        (stream) => {
          elVideo.srcObject = stream;
          elVideo.onloadedmetadata = () => {
            const container = document.querySelector(".container");
            canvasRef.current.width = container.offsetWidth;
            canvasRef.current.height = container.offsetHeight;
          };
        },
        (error) => console.error("Error al cargar la cámara:", error)
      );
    };

    cargarCamera();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const container = document.querySelector(".container");
      canvasRef.current.width = container.offsetWidth;
      canvasRef.current.height = container.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/weights"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/weights"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/weights"),
      faceapi.nets.ageGenderNet.loadFromUri("/weights"),
      faceapi.nets.faceExpressionNet.loadFromUri("/weights"),
    ])
      .then(() => {
        setModelsLoaded(true);
      })
      .catch((error) => {
        setError("Error al cargar los modelos. Por favor, inténtalo de nuevo.");
        console.error("Error al cargar los modelos:", error);
      });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
            context.strokeRect(x + 16, y, width * 1, height * 1);

            context.fillStyle = "white";
            landmarks.forEach((point) => {
              context.beginPath();
              context.arc(point.x + 18, point.y, 1.4, 0, Math.PI * 2);
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
        toast.error(
          "Error en la detección de rostros. Por favor, inténtalo de nuevo."
        );
      }
    };

    if (modelsLoaded) {
      const interval = setInterval(detect, 100);
      return () => clearInterval(interval);
    }
  }, [modelsLoaded]);

  const overwriteRecord = async () => {
    try {
      const response = await axios.post("http://localhost:4000/overwrite", {
        nombre,
        apellido,
        imageBlob: capturedImageData,
        descriptor1,
        descriptor2,
      });

      setButtonColor("success");
      toast.success("¡Empleado registrado Gracias!");
      setShowRegistroExistenteModal(false);
    } catch (error) {
      setError(
        "Error al sobrescribir el registro. Por favor, inténtalo de nuevo."
      );
      console.error("Error al sobrescribir el registro:", error);
    }
  };

  const captureImage = async () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const capturedImageData = canvas.toDataURL("image/jpeg", 0.6);

      if (capturedImageData.startsWith("data:image/jpeg;base64,")) {
        const detections = await faceapi
          .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors()
          .withAgeAndGender()
          .withFaceExpressions();

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

              setButtonColor("success");
              toast.success("¡Empleado registrado Gracias!");
            }
          } catch (error) {
            toast.error(
              "Se perdió la conexión con el servidor. Por favor, inténtalo de nuevo."
            );
            console.error("Error al enviar los datos al servidor:", error);
          }
        } else {
          toast.error("No se detectó ningún rostro. Inténtalo de nuevo.");
        }
      } else {
        toast.error("Error al capturar la imagen. Inténtalo de nuevo.");
      }
    } catch (error) {
      toast.error(
        "Error al capturar la imagen o procesar la detección. Por favor, inténtalo de nuevo."
      );
      console.error(
        "Error al capturar la imagen o procesar la detección:",
        error
      );
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div className="container" style={{ marginRight: "10px" }}>
        <video id="video" autoPlay muted ref={videoRef} />
        <canvas ref={canvasRef} className="overlay-canvas" />
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.1)",
          marginLeft: "0px",
        }}
      >
        <div className="mt-3">
          <label
            style={{ color: "red", fontWeight: "bold", alignItems: "center" }}
          >
            Nombre
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
          <label style={{ color: "red", fontWeight: "bold" }}>
            Apellido
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
              fontFamily: "Arial, sans-serif",
              backgroundColor: "blue",
              borderColor: "#4169e1",
            }}
          >
            Registro Facial
          </button>
        </div>
      </div>

      <Modal
        open={showRegistroExistenteModal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{ paddingBottom: "10px" }}
          >
            Registro de Empleado Existente !!!
          </Typography>
          <Typography
            id="modal-modal-description"
            variant="p"
            component="p"
            style={{ paddingBottom: "10px" }}
          >
            Ya existe un registro para este Empleado. ¿Deseas Actualizarlo?
          </Typography>
          <Button
            style={{
              margin: "0px 20px 10px 0px",
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
            variant="contained"
            onClick={overwriteRecord}
          >
            Si
          </Button>
          <Button
            style={{
              margin: "0px 10px 10px 0px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
            variant="contained"
            onClick={handleModalClose}
          >
            No
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default DeteccionFacial;
