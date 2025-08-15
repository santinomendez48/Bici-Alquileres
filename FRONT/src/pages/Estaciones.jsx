import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { estacionService } from "../services/estacion.service.js";
import { barrioService } from "../services/barrio.service.js";
import { toast } from "react-toastify";
import "../assets/css/alquileres.css";

function Estaciones() {
    const navigate = useNavigate();
    const [barrios, setBarrios] = useState([]);
    const [estaciones, setEstaciones] = useState([]);
    const [loading, setLoading] = useState(false);

    const { 
        register, 
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        setValue,
        reset
    } = useForm({
        defaultValues: {
            texto: "",
            barrio: "-1",
            incluyeInactivos: false
        }
    });

    useEffect(() => {
        const fetchBarrios = async () => {
            try {
                setLoading(true);
                const response = await barrioService.getAll();
                setBarrios(response.data);
            } catch (error) {
                console.error("Error al obtener barrios:", error);
                toast.error("Error al obtener barrios. Por favor, intente nuevamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchBarrios();
    }, []);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await estacionService.getAll(
                data.texto, 
                parseInt(data.barrio, 10), 
                data.incluyeInactivos.toString()
            );
            setEstaciones(response.data);
        } catch (error) {
            console.error("Error al obtener estaciones:", error);
            toast.error("Error al obtener estaciones. Por favor, intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Está seguro que desea eliminar esta estación?")) {
            try {
                setLoading(true);
                await estacionService.eliminar(id);
                toast.success("Estación eliminada exitosamente");
                // Recargar la lista de estaciones
                const formData = {
                    texto: "",
                    barrio: "-1",
                    incluyeInactivos: false
                };
                await onSubmit(formData);
            } catch (error) {
                console.error("Error al eliminar estación:", error);
                toast.error("Error al eliminar la estación. Por favor, intente nuevamente.");
            } finally {
                setLoading(false);
            }
        }
    };

    // Cargar estaciones iniciales
    useEffect(() => {
        onSubmit({
            texto: "",
            barrio: "-1",
            incluyeInactivos: false
        });
    }, []);

    return (
        <main className="container my-4">
            <div className="row mb-4">
                <div className="col d-flex justify-content-between align-items-center">
                    <h1>Estaciones</h1>
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/nueva-estacion')}
                        disabled={loading}
                    >
                        <i className="bi bi-plus-lg me-2"></i>
                        Nueva Estación
                    </button>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="texto" className="form-label">Buscar:</label>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.texto ? 'is-invalid' : ''}`}
                                    id="texto" 
                                    placeholder="Ingrese el nombre de la estación"
                                    {...register("texto")}
                                />
                                {errors.texto && (
                                    <div className="invalid-feedback">
                                        {errors.texto.message}
                                    </div>
                                )}
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="barrio" className="form-label">Barrio:</label>
                                <select 
                                    className={`form-select ${errors.barrio ? 'is-invalid' : ''}`}
                                    id="barrio"
                                    {...register("barrio")}
                                >
                                    <option value="-1">Todos</option>
                                    {barrios.map((barrio) => (
                                        <option key={barrio.idBarrio} value={barrio.idBarrio}>
                                            {barrio.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.barrio && (
                                    <div className="invalid-feedback">
                                        {errors.barrio.message}
                                    </div>
                                )}
                            </div>
                            <div className="col-md-2 d-flex align-items-end">
                                <div className="form-check form-switch">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        id="switch-inactivos"
                                        {...register("incluyeInactivos")}
                                    />
                                    <label className="form-check-label" htmlFor="switch-inactivos">
                                        Incluir Inactivos
                                    </label>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="d-flex gap-2 justify-content-end">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            reset();
                                            onSubmit({
                                                texto: "",
                                                barrio: "-1",
                                                incluyeInactivos: false
                                            });
                                        }}
                                    >
                                        Limpiar
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Buscando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-search me-2"></i>
                                                Buscar
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover table-striped mb-0">
                            <thead className="table-primary">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Fecha Alta</th>
                                    <th>Barrio</th>
                                    <th>Direccion</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estaciones.map((estacion) => (
                                    <tr key={estacion.idEstacion}>
                                        <td>{estacion.nombre}</td>
                                        <td>{new Date(estacion.fechaCreacion).toLocaleDateString()}</td>
                                        <td>{estacion.barrio?.nombre || '-'}</td>
                                        <td>{estacion.direccion ? estacion.direccion : '-'}</td>
                                        <td>
                                            <span className={`badge ${estacion.activo ? 'bg-success' : 'bg-danger'}`}>
                                                {estacion.activo ? 'Activa' : 'Inactiva'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="btn-group">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => navigate(`/editar-estacion/${estacion.idEstacion}`)}
                                                    disabled={loading}
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleEliminar(estacion.idEstacion)}
                                                    disabled={loading}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {estaciones.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No se encontraron estaciones
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Estaciones;
