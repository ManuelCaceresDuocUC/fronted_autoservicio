import React, { useState } from "react";

const CartSidebar = ({
  visible = false,
  carrito = [],
  onClose,
  onEliminar,
  onFinalizar,
  localSeleccionado,
  setLocalSeleccionado
}) => {
  const [indicaciones, setIndicaciones] = useState("");

  const total = carrito.reduce((acc, item) => {
    const precioTexto = String(item.precio || "").replace(/[^\d]/g, ""); // elimina $, CLP, etc.
    const precio = parseInt(precioTexto, 10);
    return acc + (isNaN(precio) ? 0 : precio);
  }, 0);

  const finalizarConIndicaciones = () => {
    onFinalizar(indicaciones);
    setIndicaciones(""); // Limpiar después de enviar
  };

  return (
    <>
      {/* Overlay oscuro para enfocar el sidebar */}
      {visible && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose}></div>
      )}
      
      <div
        className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out sm:rounded-l-3xl`}
        style={{ transform: visible ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sm:rounded-tl-3xl">
          <h2 className="text-2xl font-extrabold text-gray-800">Tu Carrito</h2>
          <button onClick={onClose} className="bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full p-2 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {carrito.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <p className="font-medium">El carrito está vacío</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {carrito.map((producto, index) => (
                <li key={index} className="flex justify-between items-start p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{producto.nombre}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{producto.descripcion}</p>
                    <p className="text-blue-600 font-extrabold mt-2">{producto.precio}</p>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors ml-4"
                    onClick={() => onEliminar(index)}
                    title="Eliminar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {carrito.length > 0 && (
          <div className="p-6 bg-gray-50 border-t border-gray-100 sm:rounded-bl-3xl">
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Indicaciones especiales:</label>
              <textarea
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all bg-white"
                rows="2"
                placeholder="Ej: Sin mayonesa, jugo sin hielo..."
                value={indicaciones}
                onChange={(e) => setIndicaciones(e.target.value)}
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Selecciona el local:</label>
              <select
                className="w-full border border-gray-200 p-3 rounded-xl bg-white focus:ring-2 focus:ring-yellow-400 focus:outline-none cursor-pointer"
                value={localSeleccionado}
                onChange={(e) => setLocalSeleccionado(e.target.value)}
              >
                <option value="HYATT">HYATT</option>
              </select>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-medium">Total a pagar</span>
              <span className="text-2xl font-black text-green-600">${total.toLocaleString()} CLP</span>
            </div>
            
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95"
              onClick={finalizarConIndicaciones}
            >
              Finalizar Pedido
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;