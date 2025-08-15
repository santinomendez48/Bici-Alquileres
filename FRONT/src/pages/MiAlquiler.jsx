import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { estacionService } from "../services/estacion.service.js";
import { tarifaService } from "../services/tarifas.service.js";
import { alquileresService } from "../services/alquileres.service.js";
import "../assets/css/alquileres.css";

function MiAlquiler() {
    // Estados
    const [estaciones, setEstaciones] = useState([]);
    const [tarifas, setTarifas] = useState([]);
    const [alquilerActivo, setAlquilerActivo] = useState(null);
    const [loading, setLoading] = useState(false);

    // ID Cliente hardcodeado por ahora
    const ID_CLIENTE = 1;

    // Form para iniciar alquiler
    const { 
        register: registerInicio, 
        handleSubmit: handleSubmitInicio,
        formState: { errors: errorsInicio }
    } = useForm({
        defaultValues: {
            idEstacionRetiro: '',
            idTarifa: ''
        }
    });

    // Form para finalizar alquiler
    const { 
        register: registerFin,
        handleSubmit: handleSubmitFin,
        formState: { errors: errorsFin }
    } = useForm({
        defaultValues: {
            estacionDevolucion: ''
        }
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            
            // Cargar estaciones
            const estacionesResponse = await estacionService.getAll();
            setEstaciones(estacionesResponse.data);

            // Cargar tarifas
            const tarifasResponse = await tarifaService.getAllTodas();
            setTarifas(tarifasResponse.data);

            // Verificar si hay alquiler activo
            const alquilerResponse = await alquileresService.obtenerAlquilerActivo(ID_CLIENTE);
            if (alquilerResponse.data && alquilerResponse.data.length > 0) {
                setAlquilerActivo(alquilerResponse.data[0]);
            } else {
                setAlquilerActivo(null);
            }

        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    // No hay alquileres activos - esto es un caso normal
                    setAlquilerActivo(null);
                } else {
                    console.error('Error al cargar datos:', error);
                    toast.error(error.response.data?.error || 'Error al cargar los datos. Por favor, intente nuevamente.');
                }
            } else {
                console.error('Error al cargar datos:', error);
                toast.error('Error de conexión. Por favor, verifique su conexión a internet.');
            }
        } finally {
            setLoading(false);
        }
    };

    const onIniciarAlquiler = async (data) => {
        try {
            setLoading(true);
            const response = await alquileresService.iniciarAlquiler({
                ...data,
                idCliente: ID_CLIENTE
            });
            
            setAlquilerActivo(response.data);
            toast.success('¡Alquiler iniciado con éxito!');
            
        } catch (error) {
            console.error('Error al iniciar alquiler:', error);
            if (error.response) {
                toast.error(error.response.data?.error || 'Error al iniciar el alquiler. Por favor, intente nuevamente.');
            } else {
                toast.error('Error de conexión. Por favor, verifique su conexión a internet.');
            }
        } finally {
            setLoading(false);
        }
    };

    const onFinalizarAlquiler = async (data) => {
        if (!alquilerActivo) return;

        try {
            setLoading(true);
            await alquileresService.finalizarAlquiler({
                id: alquilerActivo.id,
                idEstacionDevolucion: data.estacionDevolucion
            });
            
            setAlquilerActivo(null);
            toast.success('¡Alquiler finalizado con éxito!');
            
        } catch (error) {
            console.error('Error al finalizar alquiler:', error);
            toast.error('Error al finalizar el alquiler. Por favor, intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="container my-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="container my-4">
            <div className="row mb-4">
                <div className="col">
                    <h1>Mi Alquiler</h1>
                </div>
            </div>

            {!alquilerActivo ? (
                // Formulario para iniciar alquiler
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Iniciar Nuevo Alquiler</h5>
                        <div className="alert alert-info mb-4">
                            <i className="bi bi-info-circle me-2"></i>
                            No tienes ningún alquiler activo en este momento. Puedes iniciar uno nuevo usando el formulario a continuación.
                        </div>
                        <form onSubmit={handleSubmitInicio(onIniciarAlquiler)}>
                            <div className="mb-3">
                                <label htmlFor="idEstacionRetiro" className="form-label">Estación de Retiro</label>
                                <select 
                                    className={`form-select ${errorsInicio.idEstacionRetiro ? 'is-invalid' : ''}`}
                                    {...registerInicio('idEstacionRetiro', { required: 'Debe seleccionar una estación' })}
                                >
                                    <option value="">Seleccione una estación</option>
                                    {estaciones.map(estacion => (
                                        <option key={estacion.idEstacion} value={estacion.idEstacion}>
                                            {estacion.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errorsInicio.idEstacionRetiro && (
                                    <div className="invalid-feedback">{errorsInicio.idEstacionRetiro.message}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="idTarifa" className="form-label">Tarifa</label>
                                <select 
                                    className={`form-select ${errorsInicio.idTarifa ? 'is-invalid' : ''}`}
                                    {...registerInicio('idTarifa', { required: 'Debe seleccionar una tarifa' })}
                                >
                                    <option value="">Seleccione una tarifa</option>
                                    {tarifas.map(tarifa => (
                                        <option key={tarifa.idTarifa} value={tarifa.idTarifa}>
                                            {tarifa.descripcion} - {tarifa.tipoTarifa === 1 ? 'Normal' : 'Descuento'} - ${tarifa.montoFijoAlquiler}
                                        </option>
                                    ))}
                                </select>
                                {errorsInicio.idTarifa && (
                                    <div className="invalid-feedback">{errorsInicio.idTarifa.message}</div>
                                )}
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Iniciando...
                                    </>
                                ) : 'Iniciar Alquiler'}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                // Vista de alquiler activo y formulario para finalizar
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Alquiler en Curso</h5>
                        
                        <div className="mb-4">
                            <h6>Detalles del Alquiler:</h6>
                            <p><strong>Estación de Retiro:</strong> {alquilerActivo.estacionRetiro?.nombre}</p>
                            <p><strong>Fecha de Retiro:</strong> {new Date(alquilerActivo.fechaHoraRetiro).toLocaleString()}</p>
                            <p><strong>Tarifa:</strong> {alquilerActivo.tarifa?.descripcion}</p>
                        </div>

                        <form onSubmit={handleSubmitFin(onFinalizarAlquiler)}>
                            <div className="mb-3">
                                <label htmlFor="estacionDevolucion" className="form-label">Estación de Devolución</label>
                                <select 
                                    className={`form-select ${errorsFin.estacionDevolucion ? 'is-invalid' : ''}`}
                                    {...registerFin('estacionDevolucion', { required: 'Debe seleccionar una estación' })}
                                >
                                    <option value="">Seleccione una estación</option>
                                    {estaciones.map(estacion => (
                                        <option key={estacion.idEstacion} value={estacion.idEstacion}>
                                            {estacion.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errorsFin.estacionDevolucion && (
                                    <div className="invalid-feedback">{errorsFin.estacionDevolucion.message}</div>
                                )}
                            </div>

                            <button type="submit" className="btn btn-danger" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Finalizando...
                                    </>
                                ) : 'Finalizar Alquiler'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

export default MiAlquiler;
