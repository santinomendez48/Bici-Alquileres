import request from "supertest";
import express from "express";
import EstacionesService from "../../services/estaciones.service.js";
import estacionesRouter from "../../routes/estaciones.routes.js";
import { jest } from "@jest/globals";
import { describe, it, expect, afterEach } from "@jest/globals";

jest.mock("../../services/estaciones.service.js");
EstacionesService.buscarConFiltros = jest.fn();
EstacionesService.obtenerPorIdConBarrio = jest.fn();

const app = express();
app.use(express.json());
app.use("/estaciones", estacionesRouter);

describe("Estaciones Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /estaciones", () => {
    it("should return filtered stations", async () => {
      const mockResponse = [{ id: 1, name: "Estación Test" }];
      const responseExpected = {}
      EstacionesService.buscarConFiltros.mockResolvedValue(mockResponse);

      const response = await request(app).get("/estaciones").query({
        texto: "test",
        barrio: "1",
        incluyeInactivos: "true"
      });


      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });

    it("should handle server errors", async () => {
      EstacionesService.buscarConFiltros.mockRejectedValue(new Error("Test error"));

      const response = await request(app).get("/estaciones");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });
  });

  describe("GET /estaciones/:id", () => {
    it("should return a station by ID", async () => {
      const mockResponse = { id: 1, name: "Estación Test", barrio: "Barrio Test" };
      EstacionesService.obtenerPorIdConBarrio.mockResolvedValue(mockResponse);

      const response = await request(app).get("/estaciones/1");

      expect(EstacionesService.obtenerPorIdConBarrio).toHaveBeenCalledWith(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });

    it("should return 204 if the station is not found", async () => {
      EstacionesService.obtenerPorIdConBarrio.mockResolvedValue(null);

      const response = await request(app).get("/estaciones/999");

      expect(response.status).toBe(204);
      expect(response.body).toEqual({ error: "Estación no encontrada" });
    });

    it("should return 400 for invalid ID", async () => {
      const response = await request(app).get("/estaciones/invalid");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Parámetro incorrecto..." });
    });

    it("should handle server errors", async () => {
      EstacionesService.obtenerPorIdConBarrio.mockRejectedValue(new Error("Test error"));

      const response = await request(app).get("/estaciones/1");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });
  });
});

