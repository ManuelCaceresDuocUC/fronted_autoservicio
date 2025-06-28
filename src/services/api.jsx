import axios from "axios";
import React from 'react';
import Catalogo from './components/Catalogo';

const API = axios.create({
  baseURL: "https://realbarlacteo-1.onrender.com/api",
});
function App() {
  return (
    <div className="App">
      <Catalogo />
    </div>
  );
}
export const obtenerCatalogo = () => API.get("/catalogo");
export const crearPedido = (datos) => API.post("/pedidos", datos);
export default App;