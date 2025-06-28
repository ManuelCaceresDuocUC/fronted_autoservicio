import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Registro = () => {
  const [telefono, setTelefono] = useState("");
  const [local, setLocal] = useState("HYATT");
  const [indicaciones, setIndicaciones] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const telefonoGuardado = localStorage.getItem("telefonoUsuario");
    if (telefonoGuardado) {
      // Si ya está registrado, lo redirigimos al home
      navigate("/home");
    }
  }, [navigate]);

  const guardarDatos = () => {
    if (!telefono.trim()) {
      alert("Por favor ingresa tu número de teléfono.");
      return;
    }

    localStorage.setItem("telefonoUsuario", telefono);
    localStorage.setItem("localUsuario", local);
    localStorage.setItem("indicacionesUsuario", indicaciones);

    navigate("");
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
          className="w-full p-2 mb-4 border rounded"
          placeholder="+56912345678"
        />

        <label className="block mb-2 font-semibold">Local de retiro:</label>
        <select
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="HYATT">HYATT</option>
          <option value="CHARLES">CHARLES</option>
        </select>

        <label className="block mb-2 font-semibold">Indicaciones especiales (opcional):</label>
        <textarea
          value={indicaciones}
          onChange={(e) => setIndicaciones(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          placeholder="Ej: Sin mayonesa, entregar en portería..."
        />

        <button
          onClick={guardarDatos}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default Registro;
