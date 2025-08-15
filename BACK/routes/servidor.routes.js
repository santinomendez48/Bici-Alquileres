import express from "express";

const router = express.Router();

// Health Check
router.get("/health-check", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Echo
router.get("/echo", (req, res) => {
    const mensaje = req.query.mensaje || "No se recibió ningún mensaje";
    console.log(req.query);
    res.status(200).json({ recibido: mensaje !== "No se recibió ningún mensaje" ? `${mensaje} ${mensaje}` : mensaje });
});

export default router;
