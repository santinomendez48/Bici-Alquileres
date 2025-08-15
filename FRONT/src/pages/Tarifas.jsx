import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { tarifaService } from "../services/tarifas.service.js";
import "../assets/css/alquileres.css";

function Tarifas() {
    const navigate = useNavigate();
    const [tarifas, setTarifas] = useState([]);
    const [loading, setLoading] = useState(false);

    const { 
        register, 
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        defaultValues: {
            descripcion: '',
            tipoTarifa: 'todos',
            definicion: 'S',
            diaSemana: '',
            diaMes: '',
            mes: '',
            anio: ''
        }
    });

    const definicion = watch('definicion');

    useEffect(() => {
        cargarTarifas();
    }, []);

    const cargarTarifas = async () => {
        try {
            setLoading(true);
            const response = await tarifaService.getAllTodas();
            setTarifas(response.data);
        } catch (error) {
            console.error('Error al cargar tarifas:', error);
            toast.error('Error al cargar las tarifas. Por favor, intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            let response;
            if (data.definicion === 'S') {
                response = await tarifaService.buscarPorSemana(
                    parseInt(data.diaSemana),
                    data.tipoTarifa
                );
            } else {
                response = await tarifaService.buscarPorFecha(
                    parseInt(data.diaMes),
                    parseInt(data.mes),
                    parseInt(data.anio),
                    data.tipoTarifa
                );
            }

            setTarifas(response.data);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al obtener las tarifas. Por favor, intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async (id) => {
        if (!id) {
            toast.error('ID de tarifa no válido');
            return;
        }

        if (window.confirm('¿Está seguro que desea eliminar esta tarifa?')) {
            try {
                setLoading(true);
                await tarifaService.eliminar(id);
                await cargarTarifas();
                toast.success('Tarifa eliminada exitosamente');
            } catch (error) {
                console.error('Error al eliminar la tarifa:', error);
                toast.error(error.message || 'Error al eliminar la tarifa. Por favor, intente nuevamente.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <main className="container my-4">
            <div className="row mb-4">
                <div className="col">
                    <h1>Tarifas</h1>
                </div>
                <div className="col-auto">
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/nueva-tarifa')}
                    >
                        <i className="bi bi-plus-lg me-2"></i>
                        Nueva Tarifa
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Tipo de Tarifa</label>
                            <select 
                                className={`form-select ${errors.tipoTarifa ? 'is-invalid' : ''}`}
                                {...register("tipoTarifa")}
                            >
                                <option value="todos">Todos</option>
                                <option value="1">Normal</option>
                                <option value="2">Descuento</option>
                            </select>
                            {errors.tipoTarifa && (
                                <div className="invalid-feedback">
                                    {errors.tipoTarifa.message}
                                </div>
                            )}
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Definición</label>
                            <select 
                                className={`form-select ${errors.definicion ? 'is-invalid' : ''}`}
                                {...register("definicion")}
                            >
                                <option value="S">Por día de la semana</option>
                                <option value="C">Por fecha específica</option>
                            </select>
                            {errors.definicion && (
                                <div className="invalid-feedback">
                                    {errors.definicion.message}
                                </div>
                            )}
                        </div>

                        {definicion === 'S' ? (
                            <div className="col-md-4">
                                <label className="form-label">Día de la Semana</label>
                                <select 
                                    className={`form-select ${errors.diaSemana ? 'is-invalid' : ''}`}
                                    {...register("diaSemana")}
                                >
                                    <option value="1">Lunes</option>
                                    <option value="2">Martes</option>
                                    <option value="3">Miércoles</option>
                                    <option value="4">Jueves</option>
                                    <option value="5">Viernes</option>
                                    <option value="6">Sábado</option>
                                    <option value="7">Domingo</option>
                                </select>
                                {errors.diaSemana && (
                                    <div className="invalid-feedback">
                                        {errors.diaSemana.message}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="col-md-2">
                                    <label className="form-label">Día</label>
                                    <input 
                                        type="number" 
                                        className={`form-control ${errors.diaMes ? 'is-invalid' : ''}`}
                                        min="1" 
                                        max="31"
                                        {...register("diaMes")}
                                    />
                                    {errors.diaMes && (
                                        <div className="invalid-feedback">
                                            {errors.diaMes.message}
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Mes</label>
                                    <input 
                                        type="number" 
                                        className={`form-control ${errors.mes ? 'is-invalid' : ''}`}
                                        min="1" 
                                        max="12"
                                        {...register("mes")}
                                    />
                                    {errors.mes && (
                                        <div className="invalid-feedback">
                                            {errors.mes.message}
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Año</label>
                                    <input 
                                        type="number" 
                                        className={`form-control ${errors.anio ? 'is-invalid' : ''}`}
                                        min="2000"
                                        {...register("anio")}
                                    />
                                    {errors.anio && (
                                        <div className="invalid-feedback">
                                            {errors.anio.message}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="col-12">
                            <div className="d-flex gap-2 justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        reset();
                                        handleFiltrar();
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
                </div>
            </form>

            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover table-striped mb-0">
                            <thead className="table-primary">
                                <tr>
                                    <th>Descripción</th>
                                    <th>Tipo de Tarifa</th>
                                    <th>Definición</th>
                                    <th>Día / Fecha</th>
                                    <th>Monto Fijo</th>
                                    <th>Monto por Minuto</th>
                                    <th>Monto por Hora</th>
                                    <th>Monto por KM</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="9" className="text-center">
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Cargando...
                                        </td>
                                    </tr>
                                ) : tarifas.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center">No hay tarifas para mostrar</td>
                                    </tr>
                                ) : (
                                    tarifas.map((tarifa) => (
                                        <tr key={tarifa.idTarifa}>
                                            <td>{tarifa.descripcion}</td>
                                            <td>{tarifa.tipoTarifa === 1 ? 'Normal' : 'Descuento'}</td>
                                            <td>{tarifa.definicion === 'S' ? 'Semanal' : 'Calendario'}</td>
                                            <td>
                                                {tarifa.definicion === 'S' 
                                                    ? `Día ${tarifa.diaSemana}`
                                                    : `${tarifa.diaMes}/${tarifa.mes}/${tarifa.anio}`
                                                }
                                            </td>
                                            <td>${tarifa.montoFijoAlquiler}</td>
                                            <td>${tarifa.montoMinutoFraccion}</td>
                                            <td>${tarifa.montoHora}</td>
                                            <td>${tarifa.montoKm}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => navigate(`/editar-tarifa/${tarifa.idTarifa}`)}
                                                    disabled={loading}
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleEliminar(tarifa.idTarifa)}
                                                    disabled={loading}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Tarifas;
