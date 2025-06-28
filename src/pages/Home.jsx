import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import FloatingCartButton from "../components/FloatingCartButton";
import CartSidebar from "../components/CartSidebar";

function Home() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [indicaciones, setIndicaciones] = useState("");
  const [localSeleccionado, setLocalSeleccionado] = useState("HYATT");

  const navigate = useNavigate();
  const numeroTelefono = localStorage.getItem("numeroTelefono");

  // Redirigir si no hay número de teléfono guardado
  useEffect(() => {
    if (!numeroTelefono) {
      navigate("/identificarse");
    }
  }, [navigate, numeroTelefono]);

  useEffect(() => {
    axios.get("https://realbarlacteo-1.onrender.com/api/catalogo")
      .then(res => setProductos(res.data))
      .catch(err => console.error(err));
  }, []);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productos.map(p => (
          <ProductCard key={p.nombre} producto={p} onAgregar={agregarAlCarrito} />
        ))}
      </div>

      <FloatingCartButton
        onClick={() => setMostrarCarrito(true)}
        cantidad={carrito.length}
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
