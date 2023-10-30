// import React, { useState, useEffect, useRef } from "react";
// import { Button, Grid, Typography, Modal } from "@mui/material";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import * as faceapi from "face-api.js";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Asistencia = () => {
//   const videoRef = useRef();
//   const [mostrarToast, setMostrarToast] = useState(true);
//   const [nombreDetectado, setNombreDetectado] = useState("");
//   const [apellidoDetectado, setApellidoDetectado] = useState("");
//   const [modalAbierto, setModalAbierto] = useState(false);
//   const [tipoRegistro, setTipoRegistro] = useState(null);

//   useEffect(() => {
//     const startCameraAutomatically = async () => {
//       try {
//         await faceapi.nets.tinyFaceDetector.loadFromUri("/weights");
//         await faceapi.nets.faceLandmark68Net.loadFromUri("/weights");
//         await faceapi.nets.faceRecognitionNet.loadFromUri("/weights");

//         const video = videoRef.current;
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: {},
//         });
//         video.srcObject = stream;

//         video.addEventListener("play", async () => {
//           const displaySize = {
//             width: video.width,
//             height: video.height,
//           };

//           faceapi.matchDimensions(video, displaySize);

//           const detectionOptions = new faceapi.TinyFaceDetectorOptions();

//           setInterval(async () => {
//             const detections = await faceapi
//               .detectAllFaces(video, detectionOptions)
//               .withFaceLandmarks()
//               .withFaceDescriptors();

//             const resizedDetections = faceapi.resizeResults(
//               detections,
//               displaySize
//             );

//             const canvas = document.getElementById("overlay");
//             if (canvas) {
//               const ctx = canvas.getContext("2d");
//               ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
//               faceapi.draw.drawDetections(canvas, resizedDetections);
//               faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//             }
//           }, 100);
//         });
//       } catch (error) {
//         console.error("Error al acceder a la cámara:", error);
//       }
//     };

//     startCameraAutomatically();
//   }, []);

//   const handleEntradaClick = async () => {
//     try {
//       const video = videoRef.current;

//       if (!video) {
//         toast.error("Error al acceder al video.");
//         return;
//       }

//       const detections = await faceapi
//         .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks()
//         .withFaceDescriptors();

//       if (detections.length === 0) {
//         toast.error("No se encuentra registrado.");
//         return;
//       }

//       const descriptor1Array = detections[0].descriptor;
//       const response = await axios.get(
//         `http://localhost:4000/obtenerDescriptores`
//       );

//       const descriptoresBaseDatos = response.data;

//       if (
//         !Array.isArray(descriptoresBaseDatos) ||
//         descriptoresBaseDatos.length === 0
//       ) {
//         toast.info("No existen descriptores faciales en la BD.");
//         return;
//       }

//       const descriptor2Array = new Float32Array(128);
//       const descriptorBD = descriptoresBaseDatos[0];

//       for (let i = 0; i < 128; i++) {
//         descriptor2Array[i] = descriptorBD[i.toString()];
//       }

//       if (descriptor1Array.length !== descriptor2Array.length) {
//         console.error("Los descriptores tienen longitudes diferentes.");
//         return;
//       }

//       const distance = faceapi.euclideanDistance(
//         descriptor1Array,
//         descriptor2Array
//       );

//       console.log("Distancia entre descriptores:", distance);

//       if (distance < 0.6) {
//         setNombreDetectado(response.data.nombre);
//         setApellidoDetectado(response.data.apellido);
//         setTipoRegistro("Entrada");
//         setMostrarToast(false);

//         // Enviar datos a la tabla de asistencia
//         const responseAsistencia = await axios.post(
//           `http://localhost:4000/registrarAsistencia`,
//           {
//             nombre: response.data.nombre,
//             apellido: response.data.apellido,
//             tipoRegistro: "Entrada",
//           }
//         );

//         console.log("Registro de asistencia exitoso:", responseAsistencia.data);
//       }
//     } catch (error) {
//       console.error("Error al registrar entrada:", error);
//       toast.error("Error al registrar entrada");
//     }
//   };

//   const handleSalidaClick = async () => {
//     try {
//       const video = videoRef.current;

//       if (!video) {
//         toast.error("Error al acceder al video.");
//         return;
//       }

//       const detections = await faceapi
//         .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks()
//         .withFaceDescriptors();

//       if (detections.length === 0) {
//         toast.error("No se encuentra registrado.");
//         return;
//       }

//       const descriptor1Array = detections[0].descriptor;
//       const response = await axios.get(
//         `http://localhost:4000/obtenerDescriptores`
//       );

//       const descriptoresBaseDatos = response.data;

//       if (
//         !Array.isArray(descriptoresBaseDatos) ||
//         descriptoresBaseDatos.length === 0
//       ) {
//         toast.info("No existen descriptores faciales en la BD.");
//         return;
//       }

//       const descriptor2Array = new Float32Array(128);
//       const descriptorBD = descriptoresBaseDatos[0];

//       for (let i = 0; i < 128; i++) {
//         descriptor2Array[i] = descriptorBD[i.toString()];
//       }

//       if (descriptor1Array.length !== descriptor2Array.length) {
//         console.error("Los descriptores tienen longitudes diferentes.");
//         return;
//       }

//       const distance = faceapi.euclideanDistance(
//         descriptor1Array,
//         descriptor2Array
//       );

//       console.log("Distancia entre descriptores:", distance);

//       if (distance < 0.6) {
//         setNombreDetectado(response.data.nombre);
//         setApellidoDetectado(response.data.apellido);
//         setTipoRegistro("Salida");
//         setMostrarToast(false);

//         // Enviar datos a la tabla de asistencia
//         const responseAsistencia = await axios.post(
//           `http://localhost:4000/registrarAsistencia`,
//           {
//             nombre: response.data.nombre,
//             apellido: response.data.apellido,
//             tipoRegistro: "Salida",
//           }
//         );

//         console.log("Registro de asistencia exitoso:", responseAsistencia.data);
//       }
//     } catch (error) {
//       console.error("Error al registrar salida:", error);
//       toast.error("Error al registrar salida");
//     }
//   };

//   return (
//     <div id="video-container">
//       <video ref={videoRef} autoPlay muted width={640} height={480} />
//       <canvas
//         id="overlay"
//         width={640}
//         height={480}
//         style={{
//           position: "absolute",
//           top: "88px",
//           left: "267px",
//           pointerEvents: "none",
//           color: "#00ffff",
//           zIndex: "1",
//         }}
//         className="overlay-canvas"
//       />
//       <div style={{ textAlign: "center", marginTop: "1em" }}>
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h5" color="primary">
//             ¡Bienvenido!
//           </Typography>
//           <Typography variant="h6" color="textSecondary">
//             {nombreDetectado} {apellidoDetectado}
//           </Typography>
//         </div>
//         {!mostrarToast && (
//           <div style={{ marginTop: "1em" }}>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={
//                 tipoRegistro === "Entrada"
//                   ? handleEntradaClick
//                   : handleSalidaClick
//               }
//               style={{ margin: "0.5em" }}
//             >
//               Confirmar
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Asistencia;
