// src/components/HistorialSidebar.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function HistorialSidebar({ visible, onClose }) {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    if (!visible) return;

    const telefono = localStorage.getItem("telefonoUsuario");
    if (!telefono) return;

    axios
      .get(`https://realbarlacteo-1.onrender.com/api/pedidos/telefono?numero=${telefono}`)
      .then(res => setPedidos(res.data))
      .catch(err => console.error("Error al obtener historial:", err));
  }, [visible]);

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform ${visible ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 z-50`}>
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">Historial de Pedidos</h2>
        <button onClick={onClose} className="text-red-500 text-sm">Cerrar</button>
      </div>
      <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
        {pedidos.length === 0 ? (
          <p className="text-gray-600 text-sm">No tienes pedidos registrados.</p>
        ) : (
          pedidos.slice().reverse().map((pedido, i) => (
            <div key={i} className="mb-4 p-3 border rounded bg-gray-50">
              <p><strong>Pedido:</strong> {pedido.pedidoId}</p>
              <p><strong>Estado:</strong> {pedido.estado}</p>
              <p className="text-xs text-gray-500">{new Date(pedido.fechaCreacion).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
