// services/clienteService.js

import ClienteRepository from "../repositories/clienteRepository.js";
import BarrioRepository from "../repositories/barrioRepository.js";
import HttpError from "../util/HttpError.js";

class ClienteService {
  /**
   * Listar clientes con paginación
   * @param {{ pagina?: number, limite?: number }} params
   */
  static async listar({ pagina = 1, limite = 10 } = {}) {
    return ClienteRepository.obtenerTodos({ pagina, limite });
  }

  /**
   * Obtener un cliente por ID, lanzar HttpError si no existe
   * @param {number} id
   */
  static async obtenerPorId(id) {
    const cliente = await ClienteRepository.obtenerPorId(id);
    if (!cliente) throw new HttpError(404, "Cliente no encontrado");
    return cliente;
  }

  /**
   * Obtener un cliente por mail (campo único), lanzar HttpError si no existe
   * A modo de reforzar el concepto de reglas de negocio vamos a validad que al modificar exista un
   *  barrio con id = al id suministrado si vino idBarrio
   * @param {string} mail
   */
  static async obtenerPorMail(mail) {
    const cliente = await ClienteRepository.obtenerPorMail(mail);
    if (!cliente) throw new HttpError(404, "Cliente no encontrado");
    return cliente;
  }

  /**
   * Crear un nuevo cliente, lanzar HttpError en caso de errores de validación
   * @param {object} datos
   */
  static async crear(datos) {
    // 1) Validar barrio si vino idBarrio
    if (datos.idBarrio != null) {
      const barrio = await BarrioRepository.obtenerPorId(datos.idBarrio);
      if (!barrio) throw new HttpError(400, "Barrio no existe");
    }

    // 2) Crear
    try {
      return await ClienteRepository.crear(datos);
    }
    catch (error) {
      throw new HttpError(400, error.message);
    }
  }

  /**
   * Actualizar un cliente existente, lanzar HttpError si no existe o error de datos
   * A modo de reforzar el concepto de reglas de negocio vamos a validad que al modificar exista un
   *  barrio con id = al id suministrado si vino idBarrio
   * @param {number} id
   * @param {object} datos
   */
  static async actualizar(id, datos) {
    // 1) Validar existencia del cliente
    const cliente = await ClienteRepository.obtenerPorId(id);
    if (!cliente) throw new HttpError(404, "Cliente no encontrado");

    // 2) Validar barrio si se actualiza idBarrio
    if (datos.idBarrio != null) {
      const barrio = await BarrioRepository.obtenerPorId(datos.idBarrio);
      if (!barrio) throw new HttpError(400, "Barrio no existe");
    }

    // 3) Ejecutar update
    try {
      return await ClienteRepository.actualizar(id, datos);
    }
    catch (error) {
      throw new HttpError(400, error.message);
    }
  }

  /**
   * Eliminar un cliente por ID, lanzar HttpError si no existe
   * @param {number} id
   */
  static async eliminar(id) {
    try {
      await ClienteRepository.eliminar(id);
    }
    catch (error) {
      throw new HttpError(404, error.message);
    }
  }
}

export default ClienteService;
