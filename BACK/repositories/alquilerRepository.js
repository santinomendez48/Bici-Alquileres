import RepositorioBase from "./repositorioBase.js";
import { Op } from 'sequelize';
import Alquiler from "../models/alquiler.js";
import Cliente from "../models/cliente.js";
import Estacion from "../models/estacion.js"
import Tarifa from "../models/tarifa.js";

class AlquilerRepository extends RepositorioBase {
    constructor () {
        super(Alquiler);
    }

    // Obtener filtrados
    async obtenerFiltrados ({
        cliente = '', 
        estado = '', 
        estacionRetiro = '', 
        estacionDevolucion = '', 
        fechaRetiro = '', 
        fechaDevolucion = ''
    } = {}) {
        try {
            const where = {};
            const include = [
                {
                    model: Cliente,
                    as: 'Cliente',
                    attributes: ['idCliente', 'nombre', 'apellido']
                },
                {
                    model: Estacion,
                    as: 'estacionRetiro',
                    attributes: ['idEstacion', 'nombre']
                },
                {
                    model: Estacion,
                    as: 'estacionDevolucion',
                    attributes: ['idEstacion', 'nombre']
                }
            ];

            // Filtro por cliente (búsqueda por nombre o id)
            if (cliente) {
                where[Op.or] = [
                    { '$Cliente.nombre$': { [Op.like]: `%${cliente}%` } },
                    { '$Cliente.apellido$': { [Op.like]: `%${cliente}%` } },
                    { '$Cliente.idCliente$': isNaN(cliente) ? -1 : parseInt(cliente) }
                ];
            }

            // Filtro por estado
            if (estado !== '') {
                where.estado = parseInt(estado);
            }

            // Filtro por estación de retiro
            if (estacionRetiro) {
                where.idEstacionRetiro = parseInt(estacionRetiro);
            }

            // Filtro por estación de devolución
            if (estacionDevolucion) {
                where.idEstacionDevolucion = parseInt(estacionDevolucion);
            }

            // Filtro por fecha de retiro
            if (fechaRetiro) {
                where.fechaHoraRetiro = {
                    [Op.gte]: new Date(fechaRetiro)
                };
            }

            // Filtro por fecha de devolución
            if (fechaDevolucion) {
                where.fechaHoraDevolucion = {
                    [Op.lte]: new Date(fechaDevolucion)
                };
            }

            const alquileresEncontrados = await this.modelo.findAll({
                where,
                include,
                order: [['fechaHoraRetiro', 'DESC']]
            });
            
            return alquileresEncontrados;
        } catch (error) {
            console.error('Error en obtenerFiltrados:', error);
            throw error;
        }
    }

    // Borrar un Alquiler
    async borrarAlquiler(id) {
        const alquiler = await this.modelo.findByPk(id);
        if (!alquiler) {
            throw new Error ("No se encontro el alquiler!");
        }
        
        return this.modelo.destroy({
            where: {
                id: id
            }
        });
    }

    // iniciar datos
    async cargarAlquiler(datos) {
        const cliente = await Cliente.findByPk(datos.idCliente, {
                include: {
                    model: Alquiler,
                    as: "alquileres"
                }, 
        });
        if (!cliente) {
            throw new Error ("No se encontro al cliente!");
        }

        if (cliente.alquileres) {
            cliente.alquileres.forEach(alq => {
                if (alq.estado === 1) {
                    throw new Error ("El cliente ya tiene un alquiler iniciado!");
                }
            });
        }

        if (!datos.idCliente || !datos.idEstacionRetiro || !datos.idTarifa) {
            throw new Error ("Completar todos los datos!");
        }

        datos.fechaHoraRetiro = new Date();
        datos.estado = 1;

        return this.modelo.create(datos)
    }

    async finalizarAlquiler(datos) {
        const existeAlquiler = await Alquiler.findByPk(datos.id, {
            include: {
                model: Tarifa,
                as: "tarifa"
            }
        });

        if (!existeAlquiler) {
            throw new Error("No se encontro el alquiler!");
        }

        if (!datos.idEstacionDevolucion) {
            throw new Error("No se ingreso una estacion de devolucion!");
        }

        const estacion = await Estacion.findByPk(datos.idEstacionDevolucion);
        if (!estacion) {
            throw new Error("La estacion ingresada no es valida!");
        }

        // Crear fechas como objetos Date
        const fechaDevolucion = new Date();
        const fechaRetiro = new Date(existeAlquiler.fechaHoraRetiro);

        // Calcular diferencia en horas
        const diferenciaMs = fechaDevolucion.getTime() - fechaRetiro.getTime();
        const cantHoras = diferenciaMs / (1000 * 60 * 60); // Convertir ms a horas

        // Calcular monto
        const montoHora = existeAlquiler.tarifa.montoHora || 0;
        const montoFijo = existeAlquiler.tarifa.montoFijoAlquiler || 0;
        const monto = (cantHoras * montoHora) + montoFijo;
        const montoRedondeado = Math.round(monto * 100) / 100; // Redondear a 2 decimales

        // Preparar datos para actualizar
        const datosActualizados = {
            idEstacionDevolucion: datos.idEstacionDevolucion,
            fechaHoraDevolucion: fechaDevolucion,
            monto: montoRedondeado,
            estado: 0
        };

        // Actualizar el alquiler
        await this.modelo.update(datosActualizados, {
            where: {
                id: datos.id
            }
        });

        // Retornar el alquiler actualizado
        return this.modelo.findByPk(datos.id, {
            include: [
                {
                    model: Tarifa,
                    as: "tarifa"
                },
                {
                    model: Estacion,
                    as: "estacionRetiro"
                },
                {
                    model: Estacion,
                    as: "estacionDevolucion"
                }
            ]
        });
    }
}

export default new AlquilerRepository();