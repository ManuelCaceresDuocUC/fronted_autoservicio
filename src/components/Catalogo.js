// Catalogo.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard"; // ajusta la ruta si corresponde

const BASE = "https://realbarlacteo-1.onrender.com"; // mismo host del catálogo

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [stock, setStock] = useState([]); // [{id,nombre,disponible,stock}]
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  // Cargar catálogo una vez
  useEffect(() => {
    axios
      .get(`${BASE}/api/catalogo`)
      .then((res) => {
        setProductos(res.data || []);
        const cats = [...new Set((res.data || []).map((p) => p.categoria))];
        if (cats.length) setCategoriaSeleccionada(cats[0]);
      })
      .catch((err) => console.error("Error catálogo:", err));
  }, []);

  // Cargar stock y refrescar cada 15 s
  useEffect(() => {
    let cancel = false;
    const cargar = async () => {
      try {
        const res = await fetch(`${BASE}/api/stock`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancel) setStock(Array.isArray(data) ? data : []);
      } catch {}
    };
    cargar();
    const id = setInterval(cargar, 15000);
    return () => {
      cancel = true;
      clearInterval(id);
    };
  }, []);

  // Mapa rápido: nombre -> {disponible, stock}
  const stockMap = useMemo(() => {
    const m = new Map();
    for (const s of stock) m.set((s.nombre || "").toLowerCase(), s);
    return m;
  }, [stock]);

  // Productos filtrados + merge de stock
  const productosFiltrados = useMemo(() => {
    return productos
      .filter((p) => p.categoria === categoriaSeleccionada)
      .map((p) => {
        const s = stockMap.get((p.nombre || "").toLowerCase());
        return {
          ...p,
          disponible: s ? Boolean(s.disponible) : true,
          stock: s ? Number(s.stock) : null,
        };
      });
  }, [productos, categoriaSeleccionada, stockMap]);

  // Handler de agregar (ajústalo a tu carrito)
  const onAgregar = (producto) => {
    if (!producto?.disponible || (producto?.stock ?? 0) <= 0) return;
    // TODO: integra con tu carrito
    console.log("Agregar:", producto.nombre);
  };

  // Categorías
  const categorias = [...new Set(productos.map((p) => p.categoria))];

  return (
    <div className="p-4 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Catálogo de Productos</h1>

      {/* Botones de categoría */}
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

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productosFiltrados.map((producto, idx) => (
          <ProductCard
            key={`${producto.nombre}-${idx}`}
            producto={producto}
            onAgregar={onAgregar}
          />
        ))}
      </div>
    </div>
  );
}
