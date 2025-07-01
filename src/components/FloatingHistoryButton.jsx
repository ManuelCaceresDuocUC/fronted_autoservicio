// src/components/FloatingHistoryButton.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const FloatingHistoryButton = ({ onClick }) => {
  const [hayPedidosActivos, setHayPedidosActivos] = useState(false);

  useEffect(() => {
    const telefono = localStorage.getItem("telefonoUsuario");
    if (!telefono) return;

    axios
      .get(`https://realbarlacteo-1.onrender.com/api/pedidos/telefono?numero=${telefono}`)
      .then((res) => {
        const pedidos = res.data || [];
        const activos = pedidos.some(
          (p) => p.estado === "pagado" || p.estado === "en preparación"
        );
        setHayPedidosActivos(activos);
      })
      .catch(() => setHayPedidosActivos(false));
  }, []);

  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-4 bg-white shadow-lg p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition z-50"
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/1827/1827504.png"
        alt="Historial"
        className="w-6 h-6"
      />
      {hayPedidosActivos && (
        <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full animate-ping"></span>
      )}
    </button>
  );
};

export default FloatingHistoryButton;

