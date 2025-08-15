import api from "../../links/api.js";

const getAll = (texto, barrio, incluyeInactivos ) => api.get("/estaciones", { params: { texto,  barrio, incluyeInactivos } });
const getById = (id) => api.get(`/estaciones/${id}`);
const crear = (nuevaEstacion) => api.post("/estaciones", nuevaEstacion);
const eliminar = (id) => api.delete(`/estaciones/${id}`);
const actualizar = (id, estacion) => api.put(`/estaciones/${id}`, estacion);

export const estacionService = { getAll, getById, crear, eliminar, actualizar }
