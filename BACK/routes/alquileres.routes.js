import express from "express";
import AlquileresService from "../services/alquileres.service.js";

const router = express.Router();

// Obtener todas los ALquileres


// Cargar/crear alquiler
router.post("/", async (req, res) => {
    const alquilerPrueba = {
        idCliente: 1,
        idEstacionRetiro: 3,
        idTarifa: 2
    }

    try {
        const alquiler = await AlquileresService.cargarAlquiler(req.body)
        return res.status(201).json(alquiler)
    }
    catch (error) {
        console.error("Error al crear el alquiler!", error)
        const status = error.status || 500;
        return res.status(status).json({ error: error.message || "Error interno del servidor" });
    }
})

// Finalizar alquiler
router.put("/", async (req, res) => {
    try {
        const alquiler = await AlquileresService.finalizarAlquiler(req.body)
        return res.status(201).json(alquiler)
    }
    catch (error) {
        console.error("Error al Finalizar el alquiler!", error)
        const status = error.status || 500;
        return res.status(status).json({ error: error.message || "Error interno del servidor" });
    }
})

// Borrar alquiler
router.delete("/", async (req, res) => {
    try {
        const alquiler = await AlquileresService.borrarAlquiler(req.body.id)
        return res.status(200).json(alquiler)
    }
    catch (error) {
        console.error("Error al borrar el alquiler!", error)
        const status = error.status || 500;
        return res.status(status).json({ error: error.message || "Error interno del servidor" });
    }
});

// Obtener filtrados
router.get("/", async (req, res) => {
    try {
        const alquileres = await AlquileresService.obtenerFiltrados(req.query)
        if (alquileres.length === 0) {
            return res.status(404).json({ error: "No se encontraron alquileres" });
        }
        return res.status(200).json(alquileres)
    }
    catch (error) {
        console.error("Error al obtener los alquileres filtrados!", error)
        const status = error.status || 500;
        return res.status(status).json({ error: error.message || "Error interno del servidor" });
    }
})

export default router;