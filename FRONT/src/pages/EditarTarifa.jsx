import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { tarifaService } from '../services/tarifas.service';
import FormularioTarifa from '../components/FormularioTarifa';

const EditarTarifa = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tarifa, setTarifa] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarTarifa = async () => {
            try {
                const response = await tarifaService.obtenerPorId(id);
                setTarifa(response.data);
            } catch (error) {
                console.error('Error al cargar la tarifa:', error);
                toast.error(error.message || 'Error al cargar la tarifa');
                setTimeout(() => navigate('/tarifas'), 2000);
            } finally {
                setLoading(false);
            }
        };

        cargarTarifa();
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

    if (!tarifa) {
        return null; // El navigate en el catch del useEffect se encargará de redirigir
    }

    return (
        <div className="container mt-4">
            <div className="row mb-4">
                <div className="col">
                    <h2>Editar Tarifa</h2>
                </div>
            </div>
            <FormularioTarifa 
                tarifaInicial={tarifa}
                onSuccess={(tarifaActualizada) => {
                    console.log('Tarifa actualizada:', tarifaActualizada);
                }}
            />
        </div>
    );
};

export default EditarTarifa; 