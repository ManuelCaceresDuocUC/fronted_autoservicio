// src/components/HistorialSidebar.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function HistorialSidebar({ visible, onClose }) {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    if (!visible) return;

    const telefono = localStorage.getItem("numeroTelefono");
    if (!telefono) return;

    axios
        .get(`https://realbarlacteo-1.onrender.com/api/pedidos/telefono?numero=${encodeURIComponent(telefono)}`)
      .then(res => setPedidos(res.data))
      .catch(err => console.error("Error al obtener historial:", err));
  }, [visible]);

  return (
    <>
      {visible && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose}></div>
      )}
      
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl transform ${visible ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out z-50 flex flex-col sm:rounded-l-3xl`}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sm:rounded-tl-3xl">
          <h2 className="text-xl font-extrabold text-gray-800">Historial de Pedidos</h2>
          <button onClick={onClose} className="bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full p-2 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {pedidos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 mt-10">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              <p className="font-medium text-center">No tienes pedidos registrados.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pedidos.slice().reverse().map((pedido, i) => (
                <div key={i} className="p-5 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-bold text-gray-500 uppercase">#{pedido.pedidoId?.substring(0,8) || "Pedido"}</p>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      pedido.estado?.toLowerCase() === "entregado" ? "bg-green-100 text-green-700" :
                      pedido.estado?.toLowerCase() === "pendiente" ? "bg-yellow-100 text-yellow-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {pedido.estado}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 font-medium flex items-center mt-3">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {new Date(pedido.fechaCreacion).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}