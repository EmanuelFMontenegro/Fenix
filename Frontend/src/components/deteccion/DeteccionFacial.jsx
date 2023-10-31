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
  const [inputError, setInputError] = useState({
    nombre: false,
    apellido: false,
  });

  const handleInput = (e, field) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value) || value === "") {
      if (field === "nombre") setNombre(value);
      else setApellido(value);
      setInputError((prevState) => ({ ...prevState, [field]: false }));
    } else {
      setInputError((prevState) => ({ ...prevState, [field]: true }));
    }
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

      if (!capturedImageData.startsWith("data:image/jpeg;base64,")) {
        toast.error("Error al capturar la imagen. Inténtalo de nuevo.");
        return;
      }

      const detections = await faceapi
        .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withAgeAndGender()
        .withFaceExpressions();

      if (detections.length === 0) {
        toast.warning("Rostro no detectado. ¡Por favor regístrate!");
        return;
      }

      if (detections.length > 1) {
        toast.warning("Detectados múltiples rostros. Inténtalo de nuevo.");
        return;
      }

      // Aquí es donde debes asegurarte de extraer el descriptor correctamente
      const descriptor1 = detections[0].descriptor;

      const responseDescriptor = await axios.post(
        "http://localhost:4000/obtenerDescriptores",
        {
          descriptor: JSON.stringify(descriptor1),
        }
      );

      if (responseDescriptor.data.match) {
        toast.warning("Este rostro ya está registrado.");
        return;
      }

      const responseNombre = await axios.get(
        `http://localhost:4000/validate?nombre=${nombre}&apellido=${apellido}`
      );

      if (responseNombre.data.existe) {
        toast.warning("Ya existe un empleado con este nombre y apellido.");
        return;
      }

      // Procede a registrar si el rostro y el nombre son únicos
      const registroResponse = await axios.post(
        "http://localhost:4000/detect",
        {
          nombre,
          apellido,
          imageBlob: capturedImageData,
          descriptors: JSON.stringify(descriptor1),
        }
      );

      if (registroResponse.data) {
        toast.success("¡Empleado registrado exitosamente!");
      }
    } catch (error) {
      console.error("Error durante la captura o el registro:", error);
      toast.error("Error durante la captura o el registro.");
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
              onChange={(e) => handleInput(e, "nombre")}
              className="form-control"
              style={{
                border: inputError.nombre ? "2px solid red" : "2px solid aqua",
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
              onChange={(e) => handleInput(e, "apellido")}
              className="form-control"
              style={{
                border: inputError.apellido
                  ? "2px solid red"
                  : "2px solid aqua",
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
