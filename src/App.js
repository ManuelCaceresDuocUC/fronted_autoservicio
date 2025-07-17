// src/App.js
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <div
      className="min-h-screen bg-repeat bg-left-top relative"
      style={{ backgroundImage: "url('/img/fondo1.jpg')" }}
    >
      {/* Capa translúcida para oscurecer el fondo */}
      <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>

      {/* Contenido de la aplicación */}
      <div className="relative z-10">
        <Router>
          <AppRoutes />
        </Router>
      </div>
    </div>
  );
}

export default App;
