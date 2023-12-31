import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./pages/home/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import FaceRecognitionComponent from "./components/faceReconigtion/FaceRecognitionComponent";

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route
            path="*"
            element={
              <div className="container">
                <Sidebar />
                <Home />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
      {/* <FaceRecognitionComponent /> */}
    </div>
  );
};

export default App;
