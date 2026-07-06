import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard"; // ajusta la ruta si corresponde

const BASE = "https://realbarlacteo-1.onrender.com";

/** Normaliza un producto y asegura precio numérico */
const normalizeProducto = (p) => {
  const precioRaw = p?.precio ?? p?.price ?? 0;
  const precioNum =
    typeof precioRaw === "number"
      ? precioRaw
      : parseInt(String(precioRaw).replace(/[^\d]/g, ""), 10) || 0;

  return {
    id: p?.id ?? p?.codigo ?? `${p?.nombre ?? "item"}-${Math.random()}`,
    nombre: p?.nombre ?? "",
    descripcion: p?.descripcion ?? "",
    imagen: p?.imagen ?? p?.img ?? "",
    categoria: p?.categoria ?? "Otros",
    precio: precioNum,
  };
};

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [stock, setStock] = useState([]); // [{id,nombre,disponible,stock}]
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  // Cargar catálogo
  useEffect(() => {
    axios
      .get(`${BASE}/api/catalogo`)
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data.map(normalizeProducto) : [];
        setProductos(list);
        const cats = [...new Set(list.map((p) => p.categoria))];
        if (cats.length) setCategoriaSeleccionada(cats[0]);
      })
      .catch((err) => console.error("Error catálogo:", err));
  }, []);

  // Cargar stock y refrescar
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

  // nombre -> stock info
  const stockMap = useMemo(() => {
    const m = new Map();
    for (const s of stock) m.set((s?.nombre || "").toLowerCase(), s);
    return m;
  }, [stock]);

  // Productos filtrados con merge de stock
  const productosFiltrados = useMemo(() => {
    return productos
      .filter((p) => p.categoria === categoriaSeleccionada)
      .map((p) => {
        const s = stockMap.get((p.nombre || "").toLowerCase());
        return {
          ...p,
          disponible: s ? Boolean(s.disponible) && Number(s.stock) > 0 : true,
          stock: s ? Number(s.stock) : null,
        };
      });
  }, [productos, categoriaSeleccionada, stockMap]);

  const onAgregar = (producto) => {
    if (!producto?.disponible || (producto?.stock ?? 0) <= 0) return;
    // integra con tu carrito real
    console.log("Agregar:", producto.nombre);
  };

  const categorias = [...new Set(productos.map((p) => p.categoria))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">Catálogo de Productos</h1>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaSeleccionada(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm ${
                categoriaSeleccionada === cat
                  ? "bg-yellow-400 text-black shadow-yellow-400/40 hover:bg-yellow-500 transform -translate-y-1"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {productosFiltrados.map((producto) => (
            <ProductCard
              key={`${producto.id}`}
              producto={producto}
              onAgregar={onAgregar}
            />
          ))}
        </div>
      </div>
    </div>
  );
}