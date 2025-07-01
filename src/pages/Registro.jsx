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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Identifícate</h2>
        <label className="block mb-2 font-semibold">Teléfono:</label>
        <input
          type="tel"
          value={telefono}
          onChange={(e) => {
            setTelefono(e.target.value);
            setError(""); // Limpiar error al escribir
          }}
          className={`w-full p-2 mb-2 border rounded ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="+56912345678"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
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
