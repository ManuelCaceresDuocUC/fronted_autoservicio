// src/pages/Identificarse.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Identificarse() {
  const [telefono, setTelefono] = useState("");
  const navigate = useNavigate();

  const guardarTelefono = () => {
    if (telefono.trim().length >= 8) {
      localStorage.setItem("numeroTelefono", telefono.trim());
      navigate("/");
    } else {
      alert("Por favor ingresa un número de teléfono válido.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-white font-extrabold mb-2 tracking-tight">Bienvenido</h1>
          <p className="text-gray-300 text-sm">Ingresa tu número para gestionar tus pedidos</p>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-2">Teléfono móvil</label>
          <input
            type="tel"
            className="w-full bg-white/5 border border-gray-500 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder-gray-500"
            placeholder="Ej: +56912345678"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
        
        <button
          onClick={guardarTelefono}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg px-4 py-4 rounded-xl shadow-lg transition-transform transform active:scale-95"
        >
          Continuar al Menú
        </button>
      </div>
    </div>
  );
}