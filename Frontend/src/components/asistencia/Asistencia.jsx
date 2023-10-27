// import React, { useState, useEffect, useRef } from "react";
// import { Button, Grid, Typography, Modal } from "@mui/material";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import * as faceapi from "face-api.js";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./asistencia.scss";

// const Asistencia = () => {
//   const [mostrarToast, setMostrarToast] = useState(true);
//   const [nombreDetectado, setNombreDetectado] = useState("");
//   const [apellidoDetectado, setApellidoDetectado] = useState("");
//   const [modalAbierto, setModalAbierto] = useState(false);
//   const videoRef = useRef();
//   const canvasRef = useRef();

//   useEffect(() => {
//     if (videoRef.current && canvasRef.current) {
//       const startCameraAutomatically = async () => {
//         try {
//           await faceapi.nets.tinyFaceDetector.loadFromUri("/weights");
//           await faceapi.nets.faceLandmark68Net.loadFromUri("/weights");
//           await faceapi.nets.faceRecognitionNet.loadFromUri("/weights");

//           const video = videoRef.current;
//           const stream = await navigator.mediaDevices.getUserMedia({
//             video: {},
//           });
//           video.srcObject = stream;

//           video.addEventListener("play", async () => {
//             const displaySize = {
//               width: video.videoWidth || 640,
//               height: video.videoHeight || 480,
//             };

//             const canvas = canvasRef.current;
//             const context = canvas
//               .getContext("2d")
//               .clearRect(0, 0, canvas.width, canvas.height);

//             faceapi.matchDimensions(canvas, displaySize);

//             let deteccionRealizada = false;

//             const detect = async () => {
//               try {
//                 if (!deteccionRealizada) {
//                   const newDetections = await faceapi
//                     .detectAllFaces(
//                       video,
//                       new faceapi.TinyFaceDetectorOptions()
//                     )
//                     .withFaceLandmarks()
//                     .withFaceDescriptors();

//                   console.log("Nuevas detecciones:", newDetections);

//                   if (newDetections && newDetections.length > 0) {
//                     const detection = newDetections[0];
//                     const faceDescriptor = new Float32Array(
//                       detection.descriptor
//                     );

//                     if (
//                       faceDescriptor instanceof Float32Array &&
//                       faceDescriptor.length === 128
//                     ) {
//                       const response = await axios.post(
//                         "http://localhost:4000/research",
//                         { descriptor: Array.from(faceDescriptor) },
//                         { headers: { "Content-Type": "application/json" } }
//                       );

//                       if (response.data.existe) {
//                         const descriptor1Array = faceDescriptor;
//                         const descriptor2Array = Array.from(
//                           response.data.descriptor
//                         );

//                         if (
//                           descriptor1Array.length === 128 &&
//                           descriptor2Array.length === 128
//                         ) {
//                           const distance = faceapi.euclideanDistance(
//                             descriptor1Array,
//                             descriptor2Array
//                           );

//                           if (distance < 0.6) {
//                             setNombreDetectado(response.data.nombre);
//                             setApellidoDetectado(response.data.apellido);
//                             setMostrarToast(false);
//                           } else {
//                             console.error(
//                               "La distancia entre descriptores es demasiado grande."
//                             );
//                           }
//                         } else {
//                           console.error(
//                             "Al menos uno de los descriptores de rostro no es válido."
//                           );
//                         }
//                       } else {
//                         console.error("No existen registros de esta persona");
//                       }
//                     } else {
//                       console.error("El descriptor de rostro no es válido.");
//                     }

//                     deteccionRealizada = true;
//                   } else {
//                     console.log("No se detectaron rostros.");
//                     setNombreDetectado("");
//                     setApellidoDetectado("");
//                   }
//                 } else {
//                   console.log("Detección ya realizada.");
//                 }

//                 requestAnimationFrame(detect);
//               } catch (error) {
//                 console.error("Error en la detección de rostros:", error);
//                 toast.error(
//                   "Error en la detección de rostros. Por favor, inténtalo de nuevo."
//                 );
//               }
//             };

//             detect();
//           });
//         } catch (error) {
//           console.error("Error al acceder a la cámara:", error);
//         }
//       };

//       startCameraAutomatically();
//     }
//   }, []);

//   const handleEntradaClick = async () => {
//     try {
//       if (!nombreDetectado || !apellidoDetectado) {
//         toast.warning("Por favor, espera a que se detecte tu rostro.");
//         return;
//       }

//       const response = await axios.post(
//         `http://localhost:4000/entrada?nombre=${nombreDetectado}&apellido=${apellidoDetectado}`
//       );

//       if (response.data.success) {
//         toast.success("Entrada registrada correctamente");
//       } else {
//         toast.error("Error al registrar entrada");
//       }
//     } catch (error) {
//       console.error("Error al enviar la solicitud de entrada:", error);
//       toast.error("Error al registrar entrada");
//     }
//   };

//   const handleSalidaClick = async () => {
//     try {
//       if (!nombreDetectado || !apellidoDetectado) {
//         toast.warning("Por favor, espera a que se detecte tu rostro.");
//         return;
//       }

//       const response = await axios.post(
//         `http://localhost:4000/salida?nombre=${nombreDetectado}&apellido=${apellidoDetectado}`
//       );

//       if (response.data.success) {
//         toast.success("Salida registrada correctamente");
//       } else {
//         toast.error("Error al registrar salida");
//       }
//     } catch (error) {
//       console.error("Error al enviar la solicitud de salida:", error);
//       toast.error("Error al registrar salida");
//     }
//   };

//   return (
//     <div>
//       <div className="container">
//         <video ref={videoRef} autoPlay muted width={640} height={480} />
//         <canvas
//           id="overlay"
//           width={640}
//           height={480}
//           style={{
//             position: "absolute",
//             top: "117px",
//             left: "446px",
//             pointerEvents: "none",
//             color: "#00ffff",
//             zIndex: "1",
//           }}
//           className="overlay-canvas"
//         />
//         <canvas ref={canvasRef} className="overlay-canvas" />
//       </div>
//       <div style={{ textAlign: "center", marginTop: "1em" }}>
//         <Typography variant="h5" color="primary">
//           ¡Bienvenido!
//         </Typography>
//         <Typography variant="h6" color="textSecondary">
//           {nombreDetectado} {apellidoDetectado}
//         </Typography>
//         <div style={{ marginTop: "1em" }}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleEntradaClick}
//             style={{ margin: "0.5em" }}
//           >
//             Entrada
//           </Button>
//           <Button
//             variant="contained"
//             style={{
//               backgroundColor: "#4caf50",
//               color: "white",
//               margin: "0.5em",
//             }}
//             onClick={handleSalidaClick}
//           >
//             Salida
//           </Button>
//         </div>
//       </div>
//       <ToastContainer /> {/* Agrega el componente ToastContainer aquí */}
//       <Modal
//         open={modalAbierto}
//         onClose={() => setModalAbierto(false)}
//         aria-labelledby="modal-title"
//         aria-describedby="modal-description"
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <div
//           style={{ background: "white", padding: "1em", borderRadius: "5px" }}
//         >
//           <Typography variant="h6" id="modal-title" align="center">
//             ¡Bienvenido!
//           </Typography>
//           <Typography variant="body1" align="center">
//             {nombreDetectado} {apellidoDetectado}
//           </Typography>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default Asistencia;

import React, { useState, useEffect, useRef } from "react";
import { Button, Grid, Typography, Modal } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import * as faceapi from "face-api.js";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Asistencia = () => {
  const videoRef = useRef();
  const [mostrarToast, setMostrarToast] = useState(true);
  const [nombreDetectado, setNombreDetectado] = useState("");
  const [apellidoDetectado, setApellidoDetectado] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    const startCameraAutomatically = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/weights");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/weights");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/weights");

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
              ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
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

  const handleEntradaClick = async () => {
    try {
      const video = videoRef.current;

      if (!video) {
        toast.error("Error al acceder al video.");
        return;
      }

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 0) {
        toast.error("No se encuentre registrado.");
        return;
      }

      const descriptor1Array = detections[0].descriptor;
      const response = await axios.get(
        `http://localhost:4000/obtenerDescriptores`
      );

      const descriptoresBaseDatos = response.data;

      if (
        !Array.isArray(descriptoresBaseDatos) ||
        descriptoresBaseDatos.length === 0
      ) {
        toast.info("No existen descriptores faciales en la BD.");
        return;
      }

      let empleadoDetectado = false;

      for (const descriptorBD of descriptoresBaseDatos) {
        const descriptor2Array = new Float32Array(128);

        for (let i = 0; i < 128; i++) {
          descriptor2Array[i] = descriptorBD[i.toString()];
        }

        if (descriptor1Array.length !== descriptor2Array.length) {
          console.error("Los descriptores tienen longitudes diferentes.");
          return;
        }

        const distance = faceapi.euclideanDistance(
          descriptor1Array,
          descriptor2Array
        );

        if (distance < 0.6) {
          empleadoDetectado = true;
          break; // No es necesario seguir comparando si se encuentra una coincidencia
        }
      }

      if (empleadoDetectado) {
        toast.success("¡Empleado detectado, Bienvenido!");
      } else {
        toast.error("Empleado no detectado: Registrese");
      }
    } catch (error) {
      console.error("Error al registrar entrada:", error);
      toast.error("Error al registrar entrada");
    }
  };

  const handleSalidaClick = async () => {
    try {
      if (!nombreDetectado || !apellidoDetectado) {
        toast.warning("Por favor, espera a que se detecte tu rostro.");
        return;
      }

      const response = await axios.post(
        `http://localhost:4000/salida?nombre=${nombreDetectado}&apellido=${apellidoDetectado}`
      );

      if (response.data.success) {
        toast.success("Salida registrada correctamente");
      } else {
        toast.error("Error al registrar salida");
      }
    } catch (error) {
      toast.error("Error al registrar salida");
    }
  };
  return (
    <div id="video-container">
      <video ref={videoRef} autoPlay muted width={640} height={480} />
      <canvas
        id="overlay"
        width={640}
        height={480}
        style={{
          position: "absolute",
          top: "78px",
          left: "267px",
          pointerEvents: "none",
          color: "#00ffff",
          zIndex: "1",
        }}
        className="overlay-canvas"
      />
      <div style={{ textAlign: "center", marginTop: "1em" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" color="primary">
            ¡Bienvenido!
          </Typography>
          <Typography variant="h6" color="textSecondary">
            {nombreDetectado} {apellidoDetectado}
          </Typography>
        </div>
        <div style={{ marginTop: "1em" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEntradaClick}
            style={{ margin: "0.5em" }}
          >
            Entrada
          </Button>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#4caf50",
              color: "white",
              margin: "0.5em",
            }}
            onClick={handleSalidaClick}
          >
            Salida
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Asistencia;
