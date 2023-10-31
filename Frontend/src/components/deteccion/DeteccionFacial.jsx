import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
<<<<<<< HEAD
import { Modal, Box, Typography, Button } from "@mui/material";
=======
import { Typography, Button } from "@mui/material";
>>>>>>> main
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./deteccion.scss";

const DeteccionFacial = () => {
  const videoRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(true);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [buttonColor, setButtonColor] = useState("primary");
<<<<<<< HEAD
  const [showRegistroExistenteModal, setShowRegistroExistenteModal] = useState(false);
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
=======
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
>>>>>>> main

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
<<<<<<< HEAD
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
            context.fillText(`Edad: ${Math.round(detection.age || 0)} años`, x, y - 10);
            context.fillText(`Género: ${detection.gender || "Desconocido"}`, x, y - 30);
            context.fillText(`Emociones: ${getDominantEmotion(detection.expressions)}`, x, y - 50);
          }
=======
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
>>>>>>> main
        });
      } catch (error) {
        toast.error("Error en la detección de rostros. Por favor, inténtalo de nuevo.");
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
      setError("Error al sobrescribir el registro. Por favor, inténtalo de nuevo.");
      console.error("Error al sobrescribir el registro:", error);
    }
  };

  const captureImage = async () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
<<<<<<< HEAD
  
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("El contexto del lienzo no está disponible.");
      }
  
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
            const response = await axios.get(`http://localhost:4000/validate?nombre=${nombre}&apellido=${apellido}`);
  
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
            toast.error("Se perdió la conexión con el servidor. Por favor, inténtalo de nuevo.");
            console.error("Error al enviar los datos al servidor:", error);
          }
        } else {
          toast.error("No se detectó ningún rostro. Inténtalo de nuevo.");
        }
      } else {
        toast.error("Error al capturar la imagen. Inténtalo de nuevo.");
      }
    } catch (error) {
      toast.error("Error al capturar la imagen o procesar la detección. Por favor, inténtalo de nuevo.");
      console.error("Error al capturar la imagen o procesar la detección:", error);
=======
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
>>>>>>> main
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
<<<<<<< HEAD
      <div className="container" style={{ marginRight: "10px" }}>
        <video id="video" autoPlay muted ref={videoRef} />
        <canvas ref={canvasRef} className="overlay-canvas" />
      </div>

=======
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
>>>>>>> main
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
<<<<<<< HEAD

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
=======
>>>>>>> main
    </div>
  );
};

<<<<<<< HEAD
const style = {
=======
const toastStyle = {
>>>>>>> main
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
