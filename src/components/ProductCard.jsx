import React from "react";

function ProductCard({ producto, onAgregar }) {
  // Manejar estado inactivo visualmente si el producto no está disponible (si tienes esa lógica)
  const opacidad = producto.disponible === false ? "opacity-50 grayscale" : "";

  return (
    <div className={`bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:border-yellow-400 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group flex flex-col h-full ${opacidad}`}>
      
      <div className="overflow-hidden rounded-2xl mb-4 relative">
        <img
          src={producto.imagen || "https://via.placeholder.com/300x200?text=Sin+Imagen"}
          alt={producto.nombre}
          className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
        {producto.disponible === false && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
             <span className="bg-red-600 text-white font-bold px-3 py-1 rounded-full text-sm">Agotado</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <h2 className="text-xl font-extrabold text-gray-800 leading-tight mb-1">{producto.nombre}</h2>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{producto.descripcion}</p>
        
        <div className="flex flex-col mt-auto">
          <p className="text-blue-600 font-black text-2xl mb-4">
            {typeof producto.precio === 'number' ? `$${producto.precio.toLocaleString()}` : producto.precio}
          </p>
          
          <button
            onClick={() => onAgregar(producto)}
            disabled={producto.disponible === false}
            className={`w-full font-bold py-3 px-4 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${
              producto.disponible === false 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-yellow-400 hover:bg-yellow-500 text-black shadow-md hover:shadow-lg"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;