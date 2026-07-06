import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Registro = () => {
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const telefonoGuardado = localStorage.getItem("telefonoUsuario");
    if (telefonoGuardado) {
      navigate("/");
    }
  }, [navigate]);

  const esTelefonoValido = (numero) => {
    const regex = /^\+569\d{8}$/;
    return regex.test(numero);
  };

  const guardarTelefono = () => {
    if (!telefono.trim()) {
      setError("Por favor ingresa tu número de teléfono.");
      return;
    }

    if (!esTelefonoValido(telefono.trim())) {
      setError("El número debe tener el formato +56912345678.");
      return;
    }

    localStorage.setItem("telefonoUsuario", telefono.trim());
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2 tracking-tight">Identifícate</h2>
        <p className="text-center text-gray-500 mb-8 text-sm">Necesitamos tu número para tus pedidos</p>
        
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">Teléfono:</label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => {
              setTelefono(e.target.value);
              setError(""); // Limpiar error al escribir
            }}
            className={`w-full p-4 border rounded-xl bg-gray-50 text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-500 focus:ring-red-500" : "border-gray-200"
            }`}
            placeholder="+56912345678"
          />
          {error && <p className="text-red-500 text-sm mt-2 font-medium animate-pulse">{error}</p>}
        </div>
        
        <button
          onClick={guardarTelefono}
          className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg font-bold text-lg transition-all active:scale-95"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default Registro;