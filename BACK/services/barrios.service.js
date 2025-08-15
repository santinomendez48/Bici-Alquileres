import barrioRepository from "../repositories/barrioRepository.js"

class BarriosService {

    static obtenerTodosOrdenados = async () => {
        return await barrioRepository.obtenerTodosOrdenados()
    }

    static obtenerPorId = async (barrioId) => {
        return await barrioRepository.obtenerPorId(barrioId);
    }
}

export default BarriosService;
