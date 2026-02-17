import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import FloatingCartButton from "../components/FloatingCartButton";
import CartSidebar from "../components/CartSidebar";
import FloatingHistoryButton from "../components/FloatingHistoryButton";
import HistorialSidebar from "../components/HistorialSidebar";

function Home() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [localSeleccionado, setLocalSeleccionado] = useState("HYATT");
  const [estadoPedido, setEstadoPedido] = useState("");
  const [mensajeVisible, setMensajeVisible] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  const navigate = useNavigate();
  const numeroTelefono = localStorage.getItem("numeroTelefono");

  // Redirigir si no hay número de teléfono guardado
  useEffect(() => {
    if (!numeroTelefono) {
      navigate("/identificarse");
    }
  }, [navigate, numeroTelefono]);

  // Obtener catálogo de productos
  useEffect(() => {
    axios.get("https://realbarlacteo-1.onrender.com/api/catalogo")
      .then(res => {
        setProductos(res.data);
        const categoriasUnicas = [...new Set(res.data.map(p => p.categoria))];
        if (categoriasUnicas.length > 0) {
          setCategoriaSeleccionada(categoriasUnicas[0]);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Verificar estado del pedido cada 10 segundos
  useEffect(() => {
    if (!numeroTelefono) return;
    const intervalo = setInterval(async () => {
      try {
        const res = await axios.get(`https://realbarlacteo-1.onrender.com/api/pedidos/ultimo-estado?telefono=${encodeURIComponent(numeroTelefono)}`);
        const nuevoEstado = res.data?.estado;
        if (nuevoEstado && nuevoEstado !== "pendiente" && nuevoEstado !== estadoPedido) {
          setEstadoPedido(nuevoEstado);
          setMensajeVisible(true);
        }
      } catch (err) {
        console.error("Error al verificar el estado del pedido:", err);
      }
    }, 10000);
    return () => clearInterval(intervalo);
  }, [numeroTelefono, estadoPedido]);

  // 🕒 Verifica si el usuario está en la franja horaria restringida
  const estaEnFranjaRestringida = () => {
    const ahora = new Date();
    const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();
    const inicio = 11 * 60; // 11:00
    const fin = 17 * 60;    // 15:00
    return minutosActuales < inicio || minutosActuales >= fin;
  };

  if (estaEnFranjaRestringida()) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center px-4">
        <div className="bg-white p-6 rounded shadow max-w-md w-full">
          <h2 className="text-xl font-bold mb-4 text-red-600">⏱️ No disponible</h2>
          <p className="text-gray-700">
            El servicio está temporalmente inactivo
          </p>
        </div>
      </div>
    );
  }

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
    setMostrarCarrito(true);
  };

  const eliminarDelCarrito = (index) => {
    const nuevo = carrito.filter((_, i) => i !== index);
    setCarrito(nuevo);
  };

  const finalizarPedido = async (indicaciones) => {
    if (carrito.length === 0) return;

    // --- CORRECCIÓN AQUÍ ---
    // Usamos salto de línea (\n) y quitamos el precio del texto para no confundir al stock
    const detalle = carrito.map(p => `1 x ${p.nombre}`).join("\n");
    // -----------------------

    const monto = carrito.reduce((acc, item) => {
      // Aseguramos que item.precio sea string antes de limpiar
      const precioStr = String(item.precio || "0");
      const precio = parseInt(precioStr.replace(/[^0-9]/g, ""), 10);
      return acc + (isNaN(precio) ? 0 : precio);
    }, 0);

    try {
      const res = await axios.post("https://realbarlacteo-1.onrender.com/api/pedidos", {
        telefono: numeroTelefono || "autoservicio",
        detalle, // Ahora enviamos el detalle limpio
        monto: monto.toString(),
        indicaciones,
        local: localSeleccionado || "HYATT"
      });

      const link = res.data?.linkPago;
      if (link?.startsWith("http")) {
        window.location.href = link;
      } else {
        alert("No se pudo generar el link de pago.");
      }

    } catch (error) {
      console.error("Error al finalizar el pedido:", error);
      alert("Error al generar el pedido. Intenta nuevamente.");
    }
  };

  const categorias = [...new Set(productos.map(p => p.categoria))];

  return (
    <div className="p-6">
      <div className="flex items-center justify-center gap-4 bg-white bg-opacity-80 rounded-lg p-4 shadow-md mb-6 flex-wrap">
        <img src="/logo-bartolo.png" alt="Logo izquierdo" className="w-16 h-16 hidden sm:block" />
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Bienvenido al Bartolo Apolinav</h1>
          <p className="text-sm text-gray-800">
            Teléfono identificado: <span className="font-semibold text-blue-800">{numeroTelefono}</span>
          </p>
        </div>
        <img src="/logo-bartolo.png" alt="Logo derecho" className="w-16 h-16 hidden sm:block" />
      </div>

      {mensajeVisible && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-900 px-4 py-3 rounded mb-4 text-center">
          Tu último pedido está <strong>entregado</strong>. <button>...</button>
        </div>
      )}

      {/* 🔘 Botones de categoría */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoriaSeleccionada(cat)}
            className={`px-4 py-2 rounded-full ${
              categoriaSeleccionada === cat ? "bg-yellow-400 font-bold text-black" : "bg-gray-200 text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 📦 Productos filtrados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productos
          .filter(p => p.categoria === categoriaSeleccionada)
          .map(p => (
            <ProductCard key={p.nombre} producto={p} onAgregar={agregarAlCarrito} />
        ))}
      </div>

      <FloatingCartButton onClick={() => setMostrarCarrito(true)} cantidad={carrito.length} />
      <FloatingHistoryButton onClick={() => setMostrarHistorial(true)} />
      <HistorialSidebar visible={mostrarHistorial} onClose={() => setMostrarHistorial(false)} />
      <CartSidebar
        visible={mostrarCarrito}
        carrito={carrito}
        onClose={() => setMostrarCarrito(false)}
        onEliminar={eliminarDelCarrito}
        onFinalizar={finalizarPedido}
        localSeleccionado={localSeleccionado}
        setLocalSeleccionado={setLocalSeleccionado}
      />
    </div>
  );
}

export default Home;
