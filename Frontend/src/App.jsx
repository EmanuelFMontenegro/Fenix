import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./pages/home/Home";

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
    </div>
  );
};

export default App;
