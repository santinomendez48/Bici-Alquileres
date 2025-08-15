import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { estacionService } from "../services/estacion.service.js";
import { toast } from "react-toastify";
import FormularioEstacion from "../components/FormularioEstacion";

function EditarEstacion() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [estacion, setEstacion] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarEstacion = async () => {
            try {
                const response = await estacionService.getById(id);
                setEstacion(response.data);
            } catch (error) {
                console.error('Error al cargar la estación:', error);
                toast.error(error.message || 'Error al cargar la estación');
                setTimeout(() => navigate('/estaciones'), 1500);
            } finally {
                setLoading(false);
            }
        };

        cargarEstacion();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!estacion) {
        return null;
    }

    return (
        <main className="container my-4">
            <div className="row mb-4">
                <div className="col">
                    <h1>Editar Estación</h1>
                </div>
            </div>

            <FormularioEstacion 
                estacionInicial={estacion}
                onSuccess={(estacionActualizada) => {
                    console.log('Estación actualizada:', estacionActualizada);
                }}
            />
        </main>
    );
}

export default EditarEstacion; 