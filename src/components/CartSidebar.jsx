import React from "react";

const CartSidebar = ({ visible = false, carrito = [], onClose, onEliminar, onFinalizar }) => {
  const total = carrito.reduce((acc, item) => {
    const precio = parseInt(item.precio.replace(/[^0-9]/g, ""), 10);
    return acc + (isNaN(precio) ? 0 : precio);
  }, 0);

  return (
    <div
      className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 p-4 overflow-y-auto transform transition-transform duration-300`}
      style={{
        transform: visible ? "translateX(0)" : "translateX(100%)",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Tu carrito</h2>
        <button onClick={onClose} className="text-red-500 font-bold">X</button>
      </div>

      {carrito.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <ul>
          {carrito.map((producto, index) => (
            <li key={index} className="mb-4 border-b pb-2">
              <h3 className="font-semibold">{producto.nombre}</h3>
              <p className="text-sm text-gray-600">{producto.descripcion}</p>
              <p className="text-blue-600 font-bold">{producto.precio}</p>
              <button
                className="text-sm text-red-500 mt-1"
                onClick={() => onEliminar(index)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}

      {carrito.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <p className="font-semibold">
            Total: <span className="text-green-600">{total.toLocaleString()} CLP</span>
          </p>
          <button
            className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
            onClick={onFinalizar}
          >
            Finalizar pedido
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;

