import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios.get("https://realbarlacteo-1.onrender.com/api/catalogo")
      .then(res => setProductos(res.data))
      .catch(err => console.error("Error al obtener el catálogo:", err));
  }, []);

  return (
    <div className="p-4 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Catálogo de Productos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productos.map((producto, index) => (
          <div key={index} className="border rounded-lg shadow p-4">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h2 className="text-lg font-semibold">{producto.nombre}</h2>
            <p className="text-sm text-gray-600">{producto.descripcion}</p>
            <p className="mt-2 font-bold text-green-600">${producto.precio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalogo;
