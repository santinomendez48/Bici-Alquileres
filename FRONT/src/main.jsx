import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import 'react-toastify/dist/ReactToastify.css';

// ✅ Estilos personalizados
// import "./assets/css/bicialquileres.css";

// (opcional) Bootstrap si querés importarlo por npm
// import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);