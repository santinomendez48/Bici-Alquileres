import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Encabezado from "./components/Encabezado.jsx";
import PiePagina from "./components/PiePagina.jsx";
import Inicio from "./pages/Inicio.jsx";
import Estaciones from "./pages/Estaciones.jsx";
import Alquileres from "./pages/Alquileres.jsx";
import MiAlquiler from "./pages/MiAlquiler.jsx";
import Tarifas from "./pages/Tarifas.jsx";
import Contacto from "./pages/Contactos.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import NuevaEstacion from "./pages/NuevaEstacion";
import EditarEstacion from "./pages/EditarEstacion";
import EditarTarifa from "./pages/EditarTarifa";
import NuevaTarifa from "./pages/NuevaTarifa";
// import RecuperarPassword from "./pages/RecuperarPassword.jsx";

function AppContent() {
  const [pagina, setPagina] = useState("Inicio");
  const location = useLocation();
  
  useEffect(() => {
    const path = location.pathname.substring(1); // Elimina el '/' inicial
    if (path) {
      // Convertir el path a formato de título (ej: "mi-alquiler" -> "Mi Alquiler")
      const formattedPath = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setPagina(formattedPath);
    }
  }, [location]);

  return (
    <>
      <Encabezado setPagina={setPagina} pagina={pagina} />
      <div className="divBody">
        <Routes>
          <Route path="/" element={<Navigate to="/inicio" replace />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/estaciones" element={<Estaciones />} />
          <Route path="/nueva-estacion" element={<NuevaEstacion />} />
          <Route path="/editar-estacion/:id" element={<EditarEstacion />} />
          <Route path="/alquileres" element={<Alquileres />} />
          <Route path="/mi-alquiler" element={<MiAlquiler />} />
          <Route path="/tarifas" element={<Tarifas />} />
          <Route path="/nueva-tarifa" element={<NuevaTarifa />} />
          <Route path="/editar-tarifa/:id" element={<EditarTarifa />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/recuperar-contraseña" element={<Navigate to="/login" replace />} /> {/* Temporalmente redirige a login */}
          <Route path="*" element={<Navigate to="/inicio" replace />} />
        </Routes>
      </div>
      <PiePagina />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;