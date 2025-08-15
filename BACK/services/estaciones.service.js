import EstacionRepository from "../repositories/estacionReporitory.js";

class EstacionesService {
  static async buscarConFiltros({ texto, barrioId, incluyeInactivos }) {
    return await EstacionRepository.buscarConFiltros({
      texto,
      barrioId,
      incluyeInactivos
    });
  }

  static async obtenerPorIdConBarrio(estacionId) {
    return await EstacionRepository.obtenerPorIdConBarrio(estacionId);
  }

  static async crear(nuevaEstacion) {
    return await EstacionRepository.crear(nuevaEstacion);
  }

  static async actualizar(id, datos) {
    const estacion = await EstacionRepository.obtenerPorId(id);
    if (!estacion) {
      const error = new Error("Estación no encontrada");
      error.status = 404;
      throw error;
    }
    return await EstacionRepository.actualizar(id, datos);
  }

  static async eliminar(id) {
    const estacion = await EstacionRepository.obtenerPorId(id);
    if (!estacion) {
      const error = new Error("Estación no encontrada");
      error.status = 404;
      throw error;
    }
    return await EstacionRepository.eliminar(id);
  }
}

export default EstacionesService;

