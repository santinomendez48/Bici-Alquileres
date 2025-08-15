import api from "../../links/api";

const getAll = (filtros = {}) => api.get("/alquileres", { params: filtros });

const iniciarAlquiler = (datos) => api.post("/alquileres", datos);

const finalizarAlquiler = (datos) => api.put("/alquileres", datos);

const obtenerAlquilerActivo = (idCliente) => api.get("/alquileres", { 
    params: { 
        idCliente: idCliente,
        estado: 1
    }
});

const eliminar = (id) => api.delete("/alquileres", { data: { id } });

export const alquileresService = { 
    getAll,
    iniciarAlquiler,
    finalizarAlquiler,
    obtenerAlquilerActivo,
    eliminar
};