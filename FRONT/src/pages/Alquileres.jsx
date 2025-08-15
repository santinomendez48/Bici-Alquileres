import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { estacionService } from "../services/estacion.service.js";
import { alquileresService } from "../services/alquileres.service.js";
import '../assets/css/alquileres.css';

function Alquileres() {
    const [estaciones, setEstaciones] = useState([]);
    const [alquileres, setAlquileres] = useState([]);
    const [loading, setLoading] = useState(false);

    const { 
        register, 
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            cliente: '',
            estado: '',
            estacionRetiro: '',
            estacionDevolucion: '',
            fechaRetiro: '',
            fechaDevolucion: ''
        }
    });

    useEffect(() => {
        // Traer Estaciones
        const fetchEstaciones = async () => {
            try {
                setLoading(true);
                const response = await estacionService.getAll();
                setEstaciones(response.data);
            } catch (error) {
                console.error("Error al obtener estaciones:", error);
                toast.error("Error al obtener estaciones. Por favor, intente nuevamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchEstaciones();
        handleFiltrar(); // Cargar alquileres iniciales
    }, []);

    const handleFiltrar = async (data) => {
        try {
            setLoading(true);
            // Solo incluir en la consulta los filtros que tienen valor
            const filtrosActivos = Object.entries(data || {}).reduce((acc, [key, value]) => {
                if (value !== '') {
                    acc[key] = value;
                }
                return acc;
            }, {});

            const response = await alquileresService.getAll(filtrosActivos);
            setAlquileres(response.data);
        } catch (error) {
            console.error("Error al obtener alquileres:", error);
            toast.error("Error al obtener alquileres. Por favor, intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Está seguro que desea eliminar este alquiler?')) {
            return;
        }

        try {
            setLoading(true);
            await alquileresService.eliminar(id);
            toast.success('Alquiler eliminado con éxito');
            handleFiltrar(); // Recargar la lista
        } catch (error) {
            console.error("Error al eliminar alquiler:", error);
            toast.error(error.response?.data?.error || "Error al eliminar el alquiler. Por favor, intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    // Obtener la fecha actual para el atributo max
    const today = new Date().toISOString().split('T')[0];
    const fechaRetiro = watch('fechaRetiro');

    return (
        <main className="container my-4">
            <div className="row mb-4">
                <div className="col">
                    <h1>Historial de Alquileres</h1>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={handleSubmit(handleFiltrar)} className="row g-3">
                        <div className="col-md-6">
                            <label htmlFor="cliente" className="form-label">Cliente</label>
                            <input
                                type="text"
                                className="form-control"
                                id="cliente"
                                {...register('cliente')}
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="estado" className="form-label">Estado</label>
                            <select
                                className="form-select"
                                id="estado"
                                {...register('estado')}
                            >
                                <option value="">Todos</option>
                                <option value="1">En Curso</option>
                                <option value="0">Finalizado</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="estacionRetiro" className="form-label">Estación de Retiro</label>
                            <select
                                className="form-select"
                                id="estacionRetiro"
                                {...register('estacionRetiro')}
                            >
                                <option value="">Todas</option>
                                {estaciones.map((estacion) => (
                                    <option key={estacion.id} value={estacion.id}>
                                        {estacion.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="estacionDevolucion" className="form-label">Estación de Devolución</label>
                            <select
                                className="form-select"
                                id="estacionDevolucion"
                                {...register('estacionDevolucion')}
                            >
                                <option value="">Todas</option>
                                {estaciones.map((estacion) => (
                                    <option key={estacion.id} value={estacion.id}>
                                        {estacion.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="fechaRetiro" className="form-label">Fecha de Retiro</label>
                            <input
                                type="date"
                                className="form-control"
                                id="fechaRetiro"
                                max={today}
                                {...register('fechaRetiro')}
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="fechaDevolucion" className="form-label">Fecha de Devolución</label>
                            <input
                                type="date"
                                className="form-control"
                                id="fechaDevolucion"
                                max={today}
                                min={fechaRetiro || ''}
                                {...register('fechaDevolucion')}
                            />
                        </div>

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
                                <button type="submit" className="btn btn-primary">
                                    Filtrar
                                </button>
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
                                    <th>Cliente</th>
                                    <th>Fecha y Hora de Retiro</th>
                                    <th>Estación de Retiro</th>
                                    <th>Estación de Devolución</th>
                                    <th>Fecha y Hora de Devolución</th>
                                    <th>Estado</th>
                                    <th>Monto</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Cargando...
                                        </td>
                                    </tr>
                                ) : alquileres.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">No hay alquileres para mostrar</td>
                                    </tr>
                                ) : (
                                    alquileres.map((alquiler) => (
                                        <tr key={alquiler.id}>
                                            <td>{alquiler.Cliente?.nombre + " " + alquiler.Cliente?.apellido || "N/A"} </td>
                                            <td>{new Date(alquiler.fechaHoraRetiro).toLocaleString()}</td>
                                            <td>{alquiler.estacionRetiro?.nombre}</td>
                                            <td>{alquiler.estacionDevolucion?.nombre || '-'}</td>
                                            <td>{alquiler.fechaHoraDevolucion ? new Date(alquiler.fechaHoraDevolucion).toLocaleString() : '-'}</td>
                                            <td>
                                                <span className={`badge ${alquiler.estado === 1 ? 'bg-warning' : 'bg-success'}`}>
                                                    {alquiler.estado === 1 ? 'En Curso' : 'Finalizado'}
                                                </span>
                                            </td>
                                            <td>${alquiler.monto || '-'}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleEliminar(alquiler.id)}
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

export default Alquileres;