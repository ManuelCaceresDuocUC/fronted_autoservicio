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

  useEffect(() => {
    if (!numeroTelefono) {
      navigate("/identificarse");
    }
  }, [navigate, numeroTelefono]);

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

  const estaEnFranjaRestringida = () => {
    const ahora = new Date();
    const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();
    const inicio = 0 * 60;
    const fin = 17 * 60;
    return minutosActuales < inicio || minutosActuales >= fin;
  };

  if (estaEnFranjaRestringida()) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-center px-4">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-md w-full border border-white/10">
          <div className="text-5xl mb-4 animate-bounce">⏱️</div>
          <h2 className="text-2xl font-black mb-2 text-amber-400 tracking-tight">Servicio No Disponible</h2>
          <p className="text-slate-300 font-medium text-sm">
            El servicio se encuentra temporalmente inactivo en este horario. ¡Te esperamos pronto!
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
    const detalle = carrito.map(p => `1 x ${p.nombre}`).join("\n");
    const monto = carrito.reduce((acc, item) => {
      const precioStr = String(item.precio || "0");
      const precio = parseInt(precioStr.replace(/[^0-9]/g, ""), 10);
      return acc + (isNaN(precio) ? 0 : precio);
    }, 0);

    try {
      const res = await axios.post("https://realbarlacteo-1.onrender.com/api/pedidos", {
        telefono: numeroTelefono || "autoservicio",
        detalle,
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
    <div className="min-h-screen bg-gradient-to-tr from-slate-100 via-gray-50 to-amber-50/30 p-4 sm:p-6 lg:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Responsivo */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 bg-white/80 backdrop-blur-md border border-white rounded-2xl p-5 sm:p-6 shadow-xl shadow-slate-200/50 mb-8">
          <img src="/logo-bartolo.png" alt="Logo Izquierda" className="w-14 h-14 object-contain hidden sm:block drop-shadow" />
          <div className="text-center sm:text-left md:text-center">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Bartolo Apolinav</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Teléfono conectado: <span className="font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md ml-1">{numeroTelefono}</span>
            </p>
          </div>
          <img src="/logo-bartolo.png" alt="Logo Derecha" className="w-14 h-14 object-contain hidden sm:block drop-shadow" />
        </div>

        {mensajeVisible && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-900 px-5 py-4 rounded-xl shadow-md mb-8 flex justify-between items-center transition-all">
            <p className="text-sm sm:text-base font-medium">Tu último pedido ha sido <strong className="font-black text-emerald-700">entregado</strong> con éxito.</p>
            <button onClick={() => setMensajeVisible(false)} className="text-emerald-900 hover:text-emerald-600 font-bold ml-2 text-lg">✕</button>
          </div>
        )}

        {/* 🔘 Categorías con Scroll horizontal suave en teléfonos */}
        <div className="flex overflow-x-auto sm:flex-wrap sm:justify-center gap-2 pb-3 sm:pb-0 mb-8 scrollbar-none snap-x">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaSeleccionada(cat)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 shrink-0 snap-center shadow-sm ${
                categoriaSeleccionada === cat 
                  ? "bg-amber-400 text-slate-900 shadow-amber-400/30 transform -translate-y-0.5" 
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 📦 Grid de productos adaptativo móvil/desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {productos
            .filter(p => p.categoria === categoriaSeleccionada)
            .map(p => (
              <ProductCard key={p.nombre} producto={p} onAgregar={agregarAlCarrito} />
          ))}
        </div>
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