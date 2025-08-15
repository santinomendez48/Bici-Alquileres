export default class RepositorioBase {
    constructor(modelo) {
        this.modelo = modelo;
    }

    async obtenerTodos(params) {
        if (!params) {
            return this.modelo.findAll();
        }
        const { pagina = 1, limite = 10 } = params;
        const offset = (pagina - 1) * limite;
        return this.modelo.findAll({ limit: limite, offset });
    }

    async obtenerPorId(id) {
        return this.modelo.findByPk(id);
    }

    async crear(datos) {
        return this.modelo.create(datos);
    }

    async actualizar(id, datos) {
        const instancia = await this.modelo.findByPk(id);
        if (!instancia) throw new Error(`Error: Instancia con id: ${id} no encontrada`);

        // Actualiza los datos de la instancia
        // y guarda los cambios en la base de datos
        // Se puede usar Object.assign o el método set para asignar los datos en lote
        // Object.assign(instancia, datos);
        // instancia.set(datos);

        // y luego guardar los cambios en la base de datos
        // return instancia.save();

        // O simplemente usar el método update
        // y pasarle los datos a actualizar
        return instancia.update(datos);
    }

    async eliminar(id) {
        const instancia = await this.modelo.findByPk(id);
        if (!instancia) throw new Error(`Error: Instancia con id: ${id} no encontrada`);
        await instancia.destroy();
        return instancia;
    }

    async contarFilas() {
        return this.modelo.count();
    }
}
