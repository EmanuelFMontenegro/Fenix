import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

const FaceRecognitionComponent = () => {
  const videoRef = useRef();

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
              ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
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

  return (
    <div id="video-container">
      <video ref={videoRef} autoPlay muted width={640} height={480} />
      <canvas
        id="overlay"
        width={640}
        height={480}
        style={{
          position: "absolute",
          top: "117px",
          left: "446px",
          pointerEvents: "none",
          color: "#00ffff",
          zIndex: "1",
        }}
        className="overlay-canvas"
      />
    </div>
  );
};

export default FaceRecognitionComponent;
