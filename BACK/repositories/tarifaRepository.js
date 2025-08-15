import RepositorioBase from "./repositorioBase.js";
import Tarifa from "../models/tarifa.js";

class TarifaRepository extends RepositorioBase {
    constructor() {
        super(Tarifa);
    }

    // Metodo para buscar tarifas con filtros como descripcion y tipo

    // Buscar tarifas definidas por dia de la semana ('S')
    async buscarPorSemana({ diaSemana, tipoTarifa = -1 } = {}) {
        const where = { definicion: "S", diaSemana };

        if (!Number.isNaN(tipoTarifa) && tipoTarifa !== -1) {
            where.tipoTarifa = tipoTarifa;
        }

        return this.modelo.findAll({ where });
    }

    // Buscar tarifas definidas por fecha específica ('C')
    async buscarPorFecha({ dia, mes, anio, tipoTarifa = -1 } = {}) {
        const where = { definicion: "C", diaMes: dia, mes, anio };

        if (!Number.isNaN(tipoTarifa) && tipoTarifa !== -1) {
            where.tipoTarifa = tipoTarifa;
        }

        return this.modelo.findAll({ where });
    }

    async crear(tarifa) {
        let tarifaMismaFecha = null;
        let tarifaMismoDia = null;

        // Validar que los campos requeridos estén presentes
        if (!tarifa.descripcion) {
            throw new Error("La descripción es requerida");
        }

        if (!tarifa.definicion) {
            throw new Error("La definición es requerida");
        }

        // Validar montos
        if (tarifa.montoFijoAlquiler < 0 || tarifa.montoMinutoFraccion < 0 || tarifa.montoKm < 0 || tarifa.montoHora < 0) {
            throw new Error("Ninguno de los montos debe ser negativo!");
        }

        // Buscar tarifas existentes según la definición
        if (tarifa.definicion === "S") {
            if (!tarifa.diaSemana || tarifa.diaSemana < 1 || tarifa.diaSemana > 7) {
                throw new Error("Para tarifas semanales, el día debe estar entre 1 y 7");
            }
            tarifaMismoDia = await this.buscarPorSemana({
                diaSemana: tarifa.diaSemana,
                tipoTarifa: tarifa.tipoTarifa
            });
            
            if (tarifaMismoDia && tarifaMismoDia.length > 0) {
                throw new Error(`Ya existe una tarifa tipo ${tarifa.tipoTarifa === 1 ? 'Normal' : 'Descuento'} para ese día!`);
            }
        } else if (tarifa.definicion === "C") {
            if (!tarifa.diaMes || !tarifa.mes || !tarifa.anio ||
                tarifa.diaMes < 1 || tarifa.diaMes > 31 ||
                tarifa.mes < 1 || tarifa.mes > 12 ||
                tarifa.anio < 2000) {
                throw new Error("Fecha inválida para tarifa por calendario");
            }
            tarifaMismaFecha = await this.buscarPorFecha({
                dia: tarifa.diaMes,
                mes: tarifa.mes,
                anio: tarifa.anio,
                tipoTarifa: tarifa.tipoTarifa
            });

            if (tarifaMismaFecha && tarifaMismaFecha.length > 0) {
                throw new Error("Ya existe una tarifa para esa fecha!");
            }
        } else {
            throw new Error("La definición debe ser 'S' (semanal) o 'C' (calendario)");
        }

        // Si pasó todas las validaciones, crear la tarifa
        return this.modelo.create(tarifa);
    }

    async actualizar(id, datos) {
        let tarifaMismaFecha;
        let tarifaMismoDia;

        let existeTarifa = await this.obtenerPorId(id);
        if (!existeTarifa) {
            throw new Error(`La tarifa con id: ${id}, no existe!`);
        }
        
        await existeTarifa.set(datos);
        
        try {
            tarifaMismaFecha = await this.buscarPorFecha(existeTarifa);
            tarifaMismaFecha = tarifaMismaFecha.filter(e => e.idTarifa !== existeTarifa.idTarifa);
        }
        catch {
            tarifaMismoDia = await this.buscarPorSemana(existeTarifa);
            tarifaMismoDia = tarifaMismoDia.filter(e => e.idTarifa !== existeTarifa.idTarifa);
        }

        if (existeTarifa.definicion === "S" && tarifaMismoDia) {
            if (existeTarifa.tipoTarifa === 1 && tarifaMismoDia.length > 0) {
                throw new Error ("Ya existe una tarifa tipo Normal para ese dia!");
            } else if (existeTarifa.tipoTarifa === 2 && tarifaMismoDia.length > 0) {
                throw new Error ("Ya existe una tarifa tipo Descuento para ese dia!");
            }
        }   
        else if (existeTarifa.definicion === "C"&& tarifaMismaFecha) {
            if (tarifaMismaFecha.length > 0) {
                throw new Error ("Ya existe una tarifa con ese tipo para esa fecha!");
            }
        }
        if (existeTarifa.montoFijoAlquiler < 0 || existeTarifa.montoMinutoFraccion < 0 || existeTarifa.montoKm < 0 || existeTarifa.montoHora < 0){
            throw new Error ("Ninguno de los montos debe ser negativo!");
        }
        await existeTarifa.save();

        return existeTarifa;
    }

    async eliminar(id) {
        const existeTarifa = await this.obtenerPorId(id);
        if (!existeTarifa) {
            throw new Error(`La tarifa con id: ${id}, no existe!`);
        }
        await existeTarifa.destroy();
        return existeTarifa;
    }
}

export default new TarifaRepository();
