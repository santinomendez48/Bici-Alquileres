import React from 'react';
import FormularioTarifa from '../components/FormularioTarifa';

const NuevaTarifa = () => {
    return (
        <div className="container mt-4">
            <div className="row mb-4">
                <div className="col">
                    <h2>Nueva Tarifa</h2>
                </div>
            </div>
            
            <FormularioTarifa 
                onSuccess={(tarifaCreada) => {
                    console.log('Tarifa creada:', tarifaCreada);
                }}
            />
        </div>
    );
};

export default NuevaTarifa; 