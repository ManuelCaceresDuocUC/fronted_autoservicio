import React from "react";

function ProductCard({ producto, onAgregar }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-300 hover:border-yellow-400 rounded-xl p-4 m-2 w-64 transition transform hover:-translate-y-1 hover:shadow-xl">
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="w-full h-40 object-cover rounded mb-3"
      />
      <h2 className="text-lg font-bold text-gray-800">{producto.nombre}</h2>
      <p className="text-gray-800  font-bold text-sm">{producto.descripcion}</p>
      <p className="text-yellow-600 font-bold mt-2">{producto.precio}</p>
      <button
        onClick={() => onAgregar(producto)}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-1 px-3 rounded mt-3"
      >
        
        Agregar al carrito
      </button>
    </div>
  );
}

export default ProductCard;
