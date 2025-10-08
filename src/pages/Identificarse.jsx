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
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl text-white font-bold mb-4 text-center">Identifícate</h1>
      <p className="text-white mb-2">Ingresa tu número de teléfono para identificarte en tus pedidos:</p>
      <input
        type="tel"
        className="border rounded p-2 w-full mb-4"
        placeholder="Ej: +56912345678"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />
      <button
        onClick={guardarTelefono}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Continuar
      </button>
    </div>
  );
}
