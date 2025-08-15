import { Op } from "sequelize";
import RepositorioBase from "./repositorioBase.js";
import Estacion from "../models/estacion.js";
import Barrio from "../models/barrio.js";

class EstacionRepository extends RepositorioBase {
    constructor() {
        super(Estacion);
    }

    // Metodo para buscar estaciones con filtros de texto, barrio e inactivos
    async buscarConFiltros({ texto = "", barrioId = -1, incluyeInactivos = false } = {}) {
        const where = {};

        if (texto.trim() !== "") {
            where[Op.or] = [
                { nombre: { [Op.like]: `%${texto.trim()}%` } },
                { direccion: { [Op.like]: `%${texto.trim()}%` } }
            ];
        }

        if (!Number.isNaN(barrioId) && barrioId !== -1) {
            where.idBarrio = barrioId;
        }

        if (!incluyeInactivos) {
            where.activo = 1;
        }

        return this.modelo.findAll({
            where,
            include: {
                model: Barrio,
                as: "barrio"
            }
        });
    }

    // Metodo para obtener una estacion por id incluyendo el barrio
    async obtenerPorIdConBarrio(id) {
        return this.modelo.findByPk(id, {
            include: {
                model: Barrio,
                as: "barrio"
            }
        });
    }
}

export default new EstacionRepository();
