// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Confirmacion from "./pages/Confirmacion";
import Registro from "./pages/Registro"; // nueva vista

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    const telefono = localStorage.getItem("telefonoUsuario");
    if (!telefono) {
      navigate("/registro");
    }
  }, []);

  return (
    <Routes>
      <Route path="/registro" element={<Registro />} />
      <Route path="/" element={<Home />} />
      <Route path="/carrito" element={<Cart />} />
      <Route path="/confirmacion" element={<Confirmacion />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
