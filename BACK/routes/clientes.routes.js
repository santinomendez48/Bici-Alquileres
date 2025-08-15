// routers/clientes.routes.js

import express from "express";
import ClienteService from "../services/clienteService.js";

const router = express.Router();

// Obtener lista de clientes (paginado)
router.get("/", async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina, 10) || 1;
    const limite = parseInt(req.query.limite, 10) || 10;
    const clientes = await ClienteService.listar({ pagina, limite });
    return res.status(200).json(clientes);
  }
  catch (error) {
    console.error("Error recuperando clientes:", error);
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || "Error interno del servidor" });
  }
});

// Obtener un cliente por ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Parámetro incorrecto..." });
    }
    const cliente = await ClienteService.obtenerPorId(id);
    return res.status(200).json(cliente);
  }
  catch (error) {
    console.error("Error recuperando cliente:", error);
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || "Error interno del servidor" });
  }
});

// Obtener un cliente por mail
router.get("/mail/:mail", async (req, res) => {
  try {
    const cliente = await ClienteService.obtenerPorMail(req.params.mail);
    return res.status(200).json(cliente);
  }
  catch (error) {
    console.error("Error recuperando cliente por mail:", error);
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || "Error interno del servidor" });
  }
});

// Crear un nuevo cliente
router.post("/", async (req, res) => {
  try {
    const datos = req.body;
    const nuevo = await ClienteService.crear(datos);
    return res.status(201).json(nuevo);
  }
  catch (error) {
    console.error("Error creando cliente:", error);
    const status = error.status || 400;
    return res.status(status).json({ error: error.message || "Error al crear cliente" });
  }
});

// Actualizar un cliente existente
router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Parámetro incorrecto..." });
    }
    const datos = req.body;
    const actualizado = await ClienteService.actualizar(id, datos);
    return res.status(200).json(actualizado);
  }
  catch (error) {
    console.error("Error actualizando cliente:", error);
    const status = error.status || 400;
    return res.status(status).json({ error: error.message || "Error al actualizar cliente" });
  }
});

// Eliminar un cliente
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Parámetro incorrecto..." });
    }
    await ClienteService.eliminar(id);
    return res.status(204).send();
  }
  catch (error) {
    console.error("Error eliminando cliente:", error);
    const status = error.status || 400;
    return res.status(status).json({ error: error.message || "Error al eliminar cliente" });
  }
});

export default router;
