// src/components/FloatingHistoryButton.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const FloatingHistoryButton = ({ onClick }) => {
  const [hayPedidosActivos, setHayPedidosActivos] = useState(false);

  useEffect(() => {
    const telefono = localStorage.getItem("telefonoUsuario") || localStorage.getItem("numeroTelefono");
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
      className="fixed bottom-28 right-6 bg-white shadow-xl p-4 rounded-full border border-gray-200 hover:bg-gray-50 hover:scale-110 hover:-translate-y-1 transition-all duration-300 z-40 group"
      title="Historial de pedidos"
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/1827/1827504.png"
        alt="Historial"
        className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity"
      />
      {hayPedidosActivos && (
        <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>
      )}
    </button>
  );
};

export default FloatingHistoryButton;