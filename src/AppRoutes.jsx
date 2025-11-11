// src/AppRoutes.jsx
import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Confirmacion from "./pages/Confirmacion";
import Registro from "./pages/Registro";
import Identificarse from "./pages/Identificarse";

export default function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    const telefono = localStorage.getItem("telefonoUsuario");
    if (!telefono && window.location.pathname !== "/registro") {
      navigate("/registro", { replace: true });
    }
  }, [navigate]); // <- corrige el warning

  return (
    <Routes>
      <Route path="/registro" element={<Registro />} />
      <Route path="/identificarse" element={<Identificarse />} />
      <Route path="/" element={<Home />} />
      <Route path="/carrito" element={<Cart />} />
      <Route path="/confirmacion" element={<Confirmacion />} />
    </Routes>
  );
}
