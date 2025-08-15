import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { estacionService } from "../services/estacion.service.js";
import { barrioService } from "../services/barrio.service.js";
import { toast } from "react-toastify";

const FormularioEstacion = ({ estacionInicial = null, onSuccess }) => {
    const navigate = useNavigate();
    const [barrios, setBarrios] = useState([]);
    const [loading, setLoading] = useState(false);

    const { 
        register, 
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue
    } = useForm({
        defaultValues: {
            nombre: "",
            direccion: "",
            idBarrio: "",
            latitud: "",
            longitud: ""
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

    useEffect(() => {
        if (estacionInicial) {
            Object.keys(estacionInicial).forEach(key => {
                setValue(key, estacionInicial[key]);
            });
        }
    }, [estacionInicial, setValue]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            let response;
            
            const estacionData = {
                ...data,
                latitud: parseFloat(data.latitud),
                longitud: parseFloat(data.longitud),
                idBarrio: parseInt(data.idBarrio),
                activa: 1
            };

            if (estacionInicial) {
                response = await estacionService.actualizar(estacionInicial.idEstacion, estacionData);
                toast.success("Estación actualizada exitosamente");
            } else {
                response = await estacionService.crear(estacionData);
                toast.success("Estación creada exitosamente");
            }

            if (onSuccess) {
                onSuccess(response.data);
            }

            setTimeout(() => navigate('/estaciones'), 1500);
        } catch (error) {
            console.error("Error al guardar estación:", error);
            toast.error(error.response?.data?.error || "Error al guardar la estación. Por favor, intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container my-4">
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="nombre" className="form-label">Nombre:</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                    id="nombre"
                                    {...register("nombre", { required: "El nombre es requerido" })}
                                />
                                {errors.nombre && (
                                    <div className="invalid-feedback">
                                        {errors.nombre.message}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="direccion" className="form-label">Dirección:</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
                                    id="direccion"
                                    {...register("direccion", { required: "La dirección es requerida" })}
                                />
                                {errors.direccion && (
                                    <div className="invalid-feedback">
                                        {errors.direccion.message}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-4">
                                <label htmlFor="idBarrio" className="form-label">Barrio:</label>
                                <select
                                    className={`form-select ${errors.idBarrio ? 'is-invalid' : ''}`}
                                    id="idBarrio"
                                    {...register("idBarrio", { required: "El barrio es requerido" })}
                                >
                                    <option value="">Seleccione un barrio</option>
                                    {barrios.map((barrio) => (
                                        <option key={barrio.idBarrio} value={barrio.idBarrio}>
                                            {barrio.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.idBarrio && (
                                    <div className="invalid-feedback">
                                        {errors.idBarrio.message}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-4">
                                <label htmlFor="latitud" className="form-label">Latitud:</label>
                                <input
                                    type="number"
                                    step="any"
                                    className={`form-control ${errors.latitud ? 'is-invalid' : ''}`}
                                    id="latitud"
                                    {...register("latitud", { 
                                        required: "La latitud es requerida",
                                        valueAsNumber: true
                                    })}
                                />
                                {errors.latitud && (
                                    <div className="invalid-feedback">
                                        {errors.latitud.message}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-4">
                                <label htmlFor="longitud" className="form-label">Longitud:</label>
                                <input
                                    type="number"
                                    step="any"
                                    className={`form-control ${errors.longitud ? 'is-invalid' : ''}`}
                                    id="longitud"
                                    {...register("longitud", { 
                                        required: "La longitud es requerida",
                                        valueAsNumber: true
                                    })}
                                />
                                {errors.longitud && (
                                    <div className="invalid-feedback">
                                        {errors.longitud.message}
                                    </div>
                                )}
                            </div>

                            <div className="col-12 d-flex gap-2 justify-content-end">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/estaciones')}
                                    disabled={isSubmitting || loading}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={isSubmitting || loading}
                                >
                                    {isSubmitting || loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Guardando...
                                        </>
                                    ) : (estacionInicial ? 'Actualizar' : 'Crear')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default FormularioEstacion; 