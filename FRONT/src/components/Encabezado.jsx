import { useNavigate } from 'react-router-dom';
import "../assets/css/bicialquileres.css";

function Encabezado({setPagina, pagina}) {
    const navigate = useNavigate();

    const handleNavigation = (newPage) => {
        setPagina(newPage);
        navigate(`/${newPage.toLowerCase().replace(/\s+/g, '-')}`);
    };

    const handleLoginClick = () => {
        setPagina("Login");
        navigate('/login');
    };

    return (
        <header className="bg-dark text-white py-3 mb-4">
            <div className="ccontainer py-5 h-100 position-relative">
                <div className="usuario-pill" onClick={handleLoginClick} style={{ cursor: "pointer" }}>
                    <i className="bi bi-person-circle"></i>
                    <span>Iniciar Sesión</span>
                </div>
                <nav className="mt-3">
                    <ul className="nav nav-pills nav-fill gap-2 p-1 small bg-primary rounded-5 shadow-sm justify-content-center">
                        <li className="nav-item" role="presentation">
                            <a className={`nav-link rounded-5 ${pagina === "Inicio" ? "active" : ""}`} 
                               onClick={() => handleNavigation("Inicio")} 
                               style={{ cursor: "pointer"}}>
                                Inicio
                            </a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a className={`nav-link rounded-5 ${pagina === "Estaciones" ? "active" : ""}`} 
                               onClick={() => handleNavigation("Estaciones")} 
                               style={{ cursor: "pointer"}}>
                                Estaciones
                            </a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a className={`nav-link rounded-5 ${pagina === "Alquileres" ? "active" : ""}`} 
                               onClick={() => handleNavigation("Alquileres")} 
                               style={{ cursor: "pointer"}}>
                                Alquileres
                            </a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a className={`nav-link rounded-5 ${pagina === "Mi Alquiler" ? "active" : ""}`} 
                               onClick={() => handleNavigation("Mi Alquiler")} 
                               style={{ cursor: "pointer"}}>
                                Mi Alquiler
                            </a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a className={`nav-link rounded-5 ${pagina === "Tarifas" ? "active" : ""}`} 
                               onClick={() => handleNavigation("Tarifas")} 
                               style={{ cursor: "pointer"}}>
                                Tarifas
                            </a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a className={`nav-link rounded-5 ${pagina === "Contacto" ? "active" : ""}`} 
                               onClick={() => handleNavigation("Contacto")} 
                               style={{ cursor: "pointer"}}>
                                Contacto
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Encabezado;
