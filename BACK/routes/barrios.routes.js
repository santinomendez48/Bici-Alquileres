import express from "express";
import BarriosService from "../services/barrios.service.js";

const router = express.Router();

// Obtener todos los barrios ordenados
router.get("/", async (req, res) => {
  try {
    const barrios = await BarriosService.obtenerTodosOrdenados();

    const barriosResult = barrios.map((barrio) => ({
      idBarrio: barrio.idBarrio,
      nombre: barrio.nombre
    }));

    res.status(200).json(barriosResult);
  }
  catch (error) {
    console.error("Error recuperando barrios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener un barrio por ID
router.get("/:id", async (req, res) => {
  try {
    const paramId = req.params.id || "Error";
    const barrioId = parseInt(paramId, 10);

    if (Number.isNaN(barrioId)) {
      res.status(400).json({ error: "Parámetro incorrecto..." });
      return;
    }

    const barrio = await BarriosService.obtenerPorId(barrioId);

    if (barrio === null) {
      res.status(204).json({ error: "Barrio no encontrado" });
      return;
    }

    res.status(200).json(barrio);
  }
  catch (error) {
    console.error("Error recuperando barrio:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
