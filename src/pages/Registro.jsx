import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Registro = () => {
  const [telefono, setTelefono] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const telefonoGuardado = localStorage.getItem("telefonoUsuario");
    if (telefonoGuardado) {
      navigate("/");
    }
  }, [navigate]);

  const guardarTelefono = () => {
    if (!telefono.trim()) {
      alert("Por favor ingresa tu número de teléfono.");
      return;
    }

    localStorage.setItem("telefonoUsuario", telefono.trim());
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Identifícate</h2>
        <label className="block mb-2 font-semibold">Teléfono:</label>
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full p-2 mb-6 border rounded"
          placeholder="+56912345678"
        />
        <button
          onClick={guardarTelefono}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default Registro;
