import React from "react";
import { toast } from "react-toastify";
import FormularioEstacion from "../components/FormularioEstacion";

function NuevaEstacion() {
    return (
        <main className="container my-4">
            <div className="row mb-4">
                <div className="col">
                    <h1>Nueva Estación</h1>
                </div>
            </div>
            
            <FormularioEstacion 
                onSuccess={(estacionCreada) => {
                    console.log('Estación creada:', estacionCreada);
                }}
            />
        </main>
    );
}

export default NuevaEstacion;
