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
  const [indicaciones, setIndicaciones] = useState("");
  const [localSeleccionado, setLocalSeleccionado] = useState("HYATT");
  const [estadoPedido, setEstadoPedido] = useState("");
  const [mensajeVisible, setMensajeVisible] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

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
      .then(res => setProductos(res.data))
      .catch(err => console.error(err));
  }, []);

  // 🔁 Verificar el estado del último pedido cada 10 segundos
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
    }, 10000); // cada 10 segundos

    return () => clearInterval(intervalo);
  }, [numeroTelefono, estadoPedido]);

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

    const detalle = carrito.map(p => `${p.nombre} (${p.precio})`).join(", ");
    const monto = carrito.reduce((acc, item) => {
      const precio = parseInt(item.precio.replace(/[^0-9]/g, ""), 10);
      return acc + precio;
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
      if (link && typeof link === "string" && link.startsWith("http")) {
        window.location.href = link;
      } else {
        alert("No se pudo generar el link de pago.");
      }

    } catch (error) {
      console.error("Error al finalizar el pedido:", error);
      alert("Error al generar el pedido. Intenta nuevamente.");
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white bg-opacity-80 rounded-lg p-4 shadow-md mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Bienvenido al Bartolo Apolinav
        </h1>
        <p className="text-sm text-center text-gray-800">
          Teléfono identificado: <strong>{numeroTelefono}</strong>
        </p>
      </div>

      {/* 🔔 Mensaje reactivo de estado del pedido */}
      {mensajeVisible && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-4 text-center">
          Tu pedido está <strong>{estadoPedido}</strong>. Por favor acércate al mesón.
          <button
            className="ml-4 text-blue-600 underline"
            onClick={() => setMensajeVisible(false)}
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productos.map(p => (
          <ProductCard key={p.nombre} producto={p} onAgregar={agregarAlCarrito} />
        ))}
      </div>

      <FloatingCartButton
        onClick={() => setMostrarCarrito(true)}
        cantidad={carrito.length}
      />
      <FloatingHistoryButton
        onClick={() => setMostrarHistorial(true)} // Debes definir este estado y sidebar
      />
      <HistorialSidebar
        visible={mostrarHistorial}
        onClose={() => setMostrarHistorial(false)}
      />

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
