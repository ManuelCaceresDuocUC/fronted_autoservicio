import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  useEffect(() => {
    axios.get("https://realbarlacteo-1.onrender.com/api/catalogo")
      .then(res => {
        setProductos(res.data);

        // Selecciona automáticamente la primera categoría
        const categorias = [...new Set(res.data.map(p => p.categoria))];
        if (categorias.length > 0) {
          setCategoriaSeleccionada(categorias[0]);
        }
      })
      .catch(err => console.error("Error al obtener el catálogo:", err));
  }, []);

  // Extrae todas las categorías únicas
  const categorias = [...new Set(productos.map(p => p.categoria))];

  return (
    <div className="p-4 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Catálogo de Productos</h1>

      {/* 🔘 Botones de categoría */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaSeleccionada(cat)}
            className={`px-4 py-2 rounded-full transition ${
              categoriaSeleccionada === cat
                ? "bg-yellow-400 font-bold text-black"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 📦 Productos filtrados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productos
          .filter((producto) => producto.categoria === categoriaSeleccionada)
          .map((producto, index) => (
            <div key={index} className="border rounded-lg shadow p-4">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h2 className="text-lg font-semibold">{producto.nombre}</h2>
              <p className="text-sm text-gray-600">{producto.descripcion}</p>
              <p className="mt-2 font-bold text-green-600">{producto.precio}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Catalogo;
