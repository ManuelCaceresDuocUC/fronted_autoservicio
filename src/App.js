import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Confirmacion from "./pages/Confirmacion";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/confirmacion" element={<Confirmacion />} />
      </Routes>
    </Router>
  );
}

export default App;
