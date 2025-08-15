import RepositorioBase from "./repositorioBase.js";
import Cliente from "../models/cliente.js";
import Barrio from "../models/barrio.js";

class ClienteRepository extends RepositorioBase {
    constructor() {
        super(Cliente);
    }

    // Obtener lista de clientes incluyendo el barrio
    async obtenerTodos({ pagina = 1, limite = 10 } = {}) {
        const offset = (pagina - 1) * limite;
        return this.modelo.findAll({
            limit: limite,
            offset,
            include: { model: Barrio, as: "barrio" }
        });
    }

    // Obtener un cliente por ID incluyendo el barrio
    async obtenerPorId(id) {
        return this.modelo.findByPk(id, {
            include: { model: Barrio, as: "barrio" }
        });
    }

    // Obtener un cliente por mail (Único) incluyendo barrio
    async obtenerPorMail(mail) {
        return this.modelo.findOne({
            where: { mail },
            include: { model: Barrio, as: "barrio" }
        });
    }
}

export default new ClienteRepository();
