import express from "express";
import EstacionesService from "../services/estaciones.service.js";

const router = express.Router();

// Obtener estaciones con filtros
router.get("/", async (req, res) => {
  try {
    const texto = req.query.texto || "";
    const barrioParam = req.query.barrio || "-1";
    const incluyeInactivos = req.query.incluyeInactivos === "true";

    const barrioId = parseInt(barrioParam, 10);

    const estaciones = await EstacionesService.buscarConFiltros({
      texto,
      barrioId,
      incluyeInactivos
    });

    res.status(200).json(estaciones);
  }
  catch (error) {
    console.error("Error recuperando estaciones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener una estación por ID
router.get("/:id", async (req, res) => {
  try {
    const paramId = req.params.id || "Error";
    const estacionId = parseInt(paramId, 10);

    if (Number.isNaN(estacionId)) {
      res.status(400).json({ error: "Parámetro incorrecto..." });
      return;
    }

    const estacion = await EstacionesService.obtenerPorIdConBarrio(estacionId);

    if (estacion === null) {
      res.status(204).json({ error: "Estación no encontrada" });
      return;
    }

    res.status(200).json(estacion);
  }
  catch (error) {
    console.error("Error recuperando estación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const nuevaEstacion = req.body;

    if (!nuevaEstacion || !nuevaEstacion.nombre || !nuevaEstacion.idBarrio || !nuevaEstacion.direccion) {
      res.status(400).json({ error: "Datos incompletos para crear la estación" });
      return;
    }

    const estacionCreada = await EstacionesService.crear(nuevaEstacion);
    res.status(201).json(estacionCreada);
  }
  catch (error) {
    console.error("Error creando estación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar una estación
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Parámetro incorrecto..." });
    }

    const datosActualizacion = req.body;
    if (!datosActualizacion || !datosActualizacion.nombre || !datosActualizacion.idBarrio || !datosActualizacion.direccion) {
      return res.status(400).json({ error: "Datos incompletos para actualizar la estación" });
    }

    const estacionActualizada = await EstacionesService.actualizar(id, datosActualizacion);
    return res.status(200).json(estacionActualizada);
  }
  catch (error) {
    console.error("Error actualizando estación:", error);
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || "Error interno del servidor" });
  }
});

// Eliminar una estación
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Parámetro incorrecto..." });
    }
    await EstacionesService.eliminar(id);
    return res.status(204).send();
  }
  catch (error) {
    console.error("Error eliminando estación:", error);
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || "Error interno del servidor" });
  }
});

export default router;
