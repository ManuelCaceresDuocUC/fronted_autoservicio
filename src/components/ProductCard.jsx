import React from "react";

function ProductCard({ producto, onAgregar }) {
  return (
    <div className="bg-white shadow-md rounded p-4 m-2 w-64">
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="w-full h-40 object-cover rounded mb-2"
      />
      <h2 className="text-lg font-semibold">{producto.nombre}</h2>
      <p className="text-gray-600 text-sm">{producto.descripcion}</p>
      <p className="text-blue-600 font-bold mt-2">{producto.precio}</p>
      <button
        onClick={() => onAgregar(producto)}
        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mt-3"
      >
        Agregar al carrito
      </button>
    </div>
  );
}

export default ProductCard;
