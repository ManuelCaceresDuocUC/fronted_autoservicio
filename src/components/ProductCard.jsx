import React, { useEffect, useState } from "react";

/** Formatea a CLP desde number o string ("$3.500", "3500") */
const toCLP = (v) => {
  const n = typeof v === "number" ? v : parseInt(String(v ?? 0).replace(/[^\d]/g, ""), 10);
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(isNaN(n) ? 0 : n);
};

export default function ProductCard({ producto, onAgregar }) {
  const [stock, setStock] = useState(null);
  const [disponible, setDisponible] = useState(true);

  async function cargarStock() {
    try {
      const res = await fetch("/api/stock", { cache: "no-store" });
      if (!res.ok) return;
      const items = await res.json(); // [{id,nombre,disponible,stock}]
      const p = items.find(
        (x) => x.nombre?.toLowerCase() === producto.nombre?.toLowerCase()
      );
      if (p) {
        setStock(Number(p.stock) ?? 0);
        setDisponible(Boolean(p.disponible) && Number(p.stock) > 0);
      } else {
        setStock(0);
        setDisponible(false);
      }
    } catch {}
  }

  useEffect(() => {
    cargarStock();
    const id = setInterval(cargarStock, 15000);
    return () => clearInterval(id);
  }, [producto?.nombre]);

  const precio = toCLP(producto?.precio ?? producto?.price ?? 0);

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-300 hover:border-yellow-400 rounded-xl p-4 m-2 w-64 transition transform hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full h-40 object-cover rounded mb-3"
        />
        <span
          className={`absolute top-2 right-2 text-xs px-2 py-1 rounded ${
            disponible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          Stock: {stock ?? "…"}
        </span>
      </div>

      <h2 className="text-lg font-bold text-gray-800">{producto.nombre}</h2>
      <p className="text-gray-800 font-bold text-sm line-clamp-2">{producto.descripcion}</p>
      <p className="text-yellow-600 font-bold mt-2">{precio}</p>

      <button
        onClick={() => onAgregar?.(producto)}
        disabled={!disponible}
        className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:text-gray-500 text-black font-semibold py-1 px-3 rounded mt-3 w-full"
      >
        {disponible ? "Agregar al carrito" : "Sin stock"}
      </button>
    </div>
  );
}
