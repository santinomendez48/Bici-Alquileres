import alquilerRepository from "../repositories/alquilerRepository.js";

class AlquileresService {
    static async obtenerTodos() {
        return await alquilerRepository.obtenerTodos();
    }
    static async cargarAlquiler(datos) {
        return await alquilerRepository.cargarAlquiler(datos);
    }
    static async finalizarAlquiler(datos) {
        return await alquilerRepository.finalizarAlquiler(datos);
    }
    static async borrarAlquiler(id) {
        return await alquilerRepository.borrarAlquiler(id);
    }
    static async obtenerFiltrados(filtros) {
        return await alquilerRepository.obtenerFiltrados(filtros);
    }
}

export default AlquileresService;
