import api from "../../links/api.js";

class TarifaService {
    async getAllPaginadas() {
        return await api.get('/tarifas');
    }

    async getAllTodas() {
        return await api.get('/tarifas/all');
    }

    async buscarPorSemana(diaSemana, tipoTarifa) {
        let url = `/tarifas/semana/${diaSemana}`;
        if (tipoTarifa && tipoTarifa !== 'todos') {
            url += `?tipoTarifa=${tipoTarifa}`;
        }
        return await api.get(url);
    }

    async buscarPorFecha(dia, mes, anio, tipoTarifa) {
        let url = '/tarifas/fecha';
        const params = new URLSearchParams();
        params.append('dia', dia);
        params.append('mes', mes);
        params.append('anio', anio);
        if (tipoTarifa && tipoTarifa !== 'todos') {
            params.append('tipoTarifa', tipoTarifa);
        }
        return await api.get(`${url}?${params.toString()}`);
    }

    async obtenerPorId(id) {
        try {
            if (!id) {
                throw new Error('ID de tarifa no válido');
            }
            const response = await api.get(`/tarifas/${id}`);
            return response;
        } catch (error) {
            console.error('Error en obtenerPorId:', error);
            if (error.response) {
                throw new Error(error.response.data?.error || 'Error al obtener la tarifa');
            }
            throw error;
        }
    }

    async actualizar(id, tarifa) {
        try {
            if (!id) {
                throw new Error('ID de tarifa no válido');
            }
            const response = await api.put(`/tarifas/${id}`, tarifa);
            return response;
        } catch (error) {
            console.error('Error en actualizar:', error);
            if (error.response) {
                throw new Error(error.response.data?.error || 'Error al actualizar la tarifa');
            }
            throw error;
        }
    }

    async eliminar(id) {
        try {
            if (!id) {
                throw new Error('ID de tarifa no válido');
            }
            console.log('Eliminando tarifa con ID:', id);
            const response = await api.delete(`/tarifas/${id}`);
            console.log('Respuesta del servidor:', response);
            return response;
        } catch (error) {
            console.error('Error en eliminar:', error);
            if (error.response) {
                throw new Error(error.response.data?.error || 'Error al eliminar la tarifa');
            }
            throw error;
        }
    }

    async crear(tarifa) {
        try {
            const response = await api.post('/tarifas', tarifa);
            return response;
        } catch (error) {
            console.error('Error en crear:', error);
            if (error.response) {
                throw new Error(error.response.data?.error || 'Error al crear la tarifa');
            }
            throw error;
        }
    }
}

export const tarifaService = new TarifaService();
