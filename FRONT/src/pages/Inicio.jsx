import "../assets/css/Inicio.css";
import CardInicio from "../components/CardInicio";
import { Link } from "react-router-dom";

const cards = [
    { title: "🌱 Ecológico", text: "Reduce tu huella de carbono con un transporte sustentable."},
    { title: "💪 Saludable", text: "Hacé ejercicio mientras te movés por la ciudad."},
    { title: "🎯 Conveniente", text: "Alquiler por hora, por día o por semana. ¡Vos elegís!"}
];

function Inicio() {
    return (
        <main className="container mt-5 main">
            {/* Portada */}
            <h3 className="text-center fw-bold mb-5 display-1">
                Bienvenido al sistema BiciAlquileres Córdoba
            </h3>
            <section className="row g-4 text-center">
                {cards.map( (card, index)=> (<CardInicio key={index} cardTitle={card.title} cardText={card.text}/>))}
            </section>
            {/* Llamado a la acción */}
            <section className="text-center">
                <Link to="/estaciones" className="btn btn-primary btn-lg">
                    Ver estaciones disponibles
                </Link>
            </section>
        </main>
    );
}

export default Inicio;
