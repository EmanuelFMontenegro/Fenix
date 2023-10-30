import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Typography, Button } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./deteccion.scss";



const DeteccionFacial = () => {
  const videoRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(true);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [buttonColor, setButtonColor] = useState("primary");
  const [isRegistrado, setIsRegistrado] = useState(false);
  const [error, setError] = useState(null);

  const handleModalClose = () => {
    setNombre("");
    setApellido("");
  };

  useEffect(() => {
    const startCameraAutomatically = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/weights");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/weights");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/weights");
        await faceapi.nets.ageGenderNet.loadFromUri("/weights");
        await faceapi.nets.faceExpressionNet.loadFromUri("/weights");

        const video = videoRef.current;
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {},
        });
        video.srcObject = stream;

        video.addEventListener("play", async () => {
          const displaySize = {
            width: video.width,
            height: video.height,
          };

          faceapi.matchDimensions(video, displaySize);

          const detectionOptions = new faceapi.TinyFaceDetectorOptions();

          setInterval(async () => {
            const detections = await faceapi
              .detectAllFaces(video, detectionOptions)
              .withFaceLandmarks()
              .withFaceDescriptors();

            const resizedDetections = faceapi.resizeResults(
              detections,
              displaySize
            );

            const canvas = document.getElementById("overlay");
            if (canvas) {
              const ctx = canvas.getContext("2d");
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              faceapi.draw.drawDetections(canvas, resizedDetections);
              faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            }
          }, 100);
        });
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
      }
    };

    startCameraAutomatically();
  }, []);

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
              setIsRegistrado(true);
              showRegistroExistenteToast();
              return;
            } else {
              const descriptor1 = detections[0].descriptor;

              const registroResponse = await axios.post(
                "http://localhost:4000/detect",
                {
                  nombre,
                  apellido,
                  imageBlob: capturedImageData,
                  descriptors: descriptor1, // Se guarda el descriptor completo
                }
              );

              setButtonColor("success");
              toast.success("¡Empleado registrado Gracias!");
            }
          } catch (error) {
            // ... (manejar errores)
          }
        } else {
          toast.error("No se detectó ningún rostro. Inténtalo de nuevo.");
        }
      } else {
        toast.error("Error al capturar la imagen. Inténtalo de nuevo.");
      }
    } catch (error) {
      // ... (manejar errores)
    }
  };

  const showRegistroExistenteToast = () => {
    toast.info("¡Ya existe este Registro !", {
      autoClose: 500,
      onClose: () => {
        setNombre("");
        setApellido("");
        setIsRegistrado(false);
      },
    });
  };

  return (
    <div style={{ display: "flex" }}>
      <video ref={videoRef} autoPlay muted width={640} height={480} />
      <canvas
        id="overlay"
        width={640}
        height={480}
        style={{
          position: "absolute",
          top: "88px",
          left: "267px",
          pointerEvents: "none",
          color: "#00ffff",
          zIndex: "1",
        }}
        className="overlay-canvas"
      />
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "0px",
          boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.1)",
          marginLeft: "0px",
        }}
      >
        <div className="mt-3">
  <label className="label">
    Nombre
    <input
      type="text"
      value={nombre}
      onChange={(e) => setNombre(e.target.value)}
      className="form-control label-input" // aquí referencias las clases de SCSS
    />
  </label>
  <br />
  <label className="label">
    Apellido
    <input
      type="text"
      value={apellido}
      onChange={(e) => setApellido(e.target.value)}
      className="form-control label-input" // aquí referencias las clases de SCSS
    />
  </label>
  <br />
  <button
    type="button"
    className={`btn button`} // aquí referencias las clases de SCSS
    onClick={captureImage}
    disabled={!modelsLoaded || !nombre || !apellido}
  >
    REGISTRAR ROSTRO
  </button>
</div>

      </div>
    </div>
  );
};

const toastStyle = {
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
