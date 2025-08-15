import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { tarifaService } from '../services/tarifas.service';

const FormularioTarifa = ({ tarifaInicial = null, onSuccess }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const { 
        register, 
        handleSubmit, 
        watch,
        formState: { errors },
        reset,
        setValue
    } = useForm({
        defaultValues: {
            descripcion: '',
            tipoTarifa: 1,
            definicion: 'S',
            diaSemana: 1,
            diaMes: 1,
            mes: 1,
            anio: new Date().getFullYear(),
            montoFijoAlquiler: 0,
            montoMinutoFraccion: 0,
            montoKm: 0,
            montoHora: 0
        }
    });

    const definicion = watch('definicion');

    useEffect(() => {
        if (tarifaInicial) {
            Object.keys(tarifaInicial).forEach(key => {
                setValue(key, tarifaInicial[key]);
            });
        }
    }, [tarifaInicial, setValue]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            let response;
            if (tarifaInicial) {
                response = await tarifaService.actualizar(tarifaInicial.idTarifa, data);
                toast.success('Tarifa actualizada exitosamente');
            } else {
                response = await tarifaService.crear(data);
                toast.success('Tarifa creada exitosamente');
            }
            
            if (onSuccess) {
                onSuccess(response.data);
            }
            
            setTimeout(() => navigate('/tarifas'), 1500);
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || `Error al ${tarifaInicial ? 'actualizar' : 'crear'} la tarifa`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="card">
            <div className="card-body">
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Descripción</label>
                        <input
                            type="text"
                            className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
                            {...register("descripcion", { 
                                required: "La descripción es requerida",
                                maxLength: { 
                                    value: 100, 
                                    message: "La descripción no puede exceder los 100 caracteres" 
                                }
                            })}
                        />
                        {errors.descripcion && (
                            <div className="invalid-feedback">
                                {errors.descripcion.message}
                            </div>
                        )}
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Tipo de Tarifa</label>
                        <select 
                            className={`form-select ${errors.tipoTarifa ? 'is-invalid' : ''}`}
                            {...register("tipoTarifa")}
                        >
                            <option value={1}>Normal</option>
                            <option value={2}>Descuento</option>
                        </select>
                        {errors.tipoTarifa && (
                            <div className="invalid-feedback">
                                {errors.tipoTarifa.message}
                            </div>
                        )}
                    </div>

                    <div className="col-md-3">
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

                    <div className="col-12 mt-4 mb-3">
                        <h5 className="border-bottom pb-2">Período de Aplicación</h5>
                    </div>

                    {definicion === 'S' ? (
                        <div className="col-md-4">
                            <label className="form-label">Día de la Semana</label>
                            <select 
                                className={`form-select ${errors.diaSemana ? 'is-invalid' : ''}`}
                                {...register("diaSemana", {
                                    required: "El día de la semana es requerido"
                                })}
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
                                    {...register("diaMes", {
                                        required: "El día es requerido",
                                        min: { value: 1, message: "El día debe ser entre 1 y 31" },
                                        max: { value: 31, message: "El día debe ser entre 1 y 31" }
                                    })}
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
                                    {...register("mes", {
                                        required: "El mes es requerido",
                                        min: { value: 1, message: "El mes debe ser entre 1 y 12" },
                                        max: { value: 12, message: "El mes debe ser entre 1 y 12" }
                                    })}
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
                                    {...register("anio", {
                                        required: "El año es requerido",
                                        min: { value: 2000, message: "El año debe ser mayor a 2000" }
                                    })}
                                />
                                {errors.anio && (
                                    <div className="invalid-feedback">
                                        {errors.anio.message}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <div className="col-12 mt-4 mb-3">
                        <h5 className="border-bottom pb-2">Montos</h5>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Monto Fijo</label>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                                type="number"
                                step="0.01"
                                className={`form-control ${errors.montoFijoAlquiler ? 'is-invalid' : ''}`}
                                {...register("montoFijoAlquiler", { 
                                    required: "El monto fijo es requerido",
                                    min: { value: 0, message: "El monto debe ser mayor o igual a 0" }
                                })}
                            />
                            {errors.montoFijoAlquiler && (
                                <div className="invalid-feedback">
                                    {errors.montoFijoAlquiler.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Monto por Minuto</label>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                                type="number"
                                step="0.01"
                                className={`form-control ${errors.montoMinutoFraccion ? 'is-invalid' : ''}`}
                                {...register("montoMinutoFraccion", { 
                                    required: "El monto por minuto es requerido",
                                    min: { value: 0, message: "El monto debe ser mayor o igual a 0" }
                                })}
                            />
                            {errors.montoMinutoFraccion && (
                                <div className="invalid-feedback">
                                    {errors.montoMinutoFraccion.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Monto por KM</label>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                                type="number"
                                step="0.01"
                                className={`form-control ${errors.montoKm ? 'is-invalid' : ''}`}
                                {...register("montoKm", { 
                                    required: "El monto por KM es requerido",
                                    min: { value: 0, message: "El monto debe ser mayor o igual a 0" }
                                })}
                            />
                            {errors.montoKm && (
                                <div className="invalid-feedback">
                                    {errors.montoKm.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Monto por Hora</label>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                                type="number"
                                step="0.01"
                                className={`form-control ${errors.montoHora ? 'is-invalid' : ''}`}
                                {...register("montoHora", { 
                                    required: "El monto por hora es requerido",
                                    min: { value: 0, message: "El monto debe ser mayor o igual a 0" }
                                })}
                            />
                            {errors.montoHora && (
                                <div className="invalid-feedback">
                                    {errors.montoHora.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-12 mt-4">
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    {tarifaInicial ? 'Actualizando...' : 'Creando...'}
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-lg me-2"></i>
                                    {tarifaInicial ? 'Actualizar' : 'Crear'} Tarifa
                                </>
                            )}
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-outline-secondary ms-2"
                            onClick={() => navigate('/tarifas')}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default FormularioTarifa; 