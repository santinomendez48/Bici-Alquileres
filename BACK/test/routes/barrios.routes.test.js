import BarriosService from "../../services/barrios.service";
import barriosRouter from "../../routes/barrios.routes.js";
import {jest} from "@jest/globals";
import {describe, it, expect, afterEach } from "@jest/globals";
import express from "express";
import request from "supertest";

jest.mock("../../services/barrios.service.js");
BarriosService.obtenerTodosOrdenados = jest.fn();
BarriosService.obtenerPorId = jest.fn();

const app = express();
app.use(express.json());
app.use("/barrios", barriosRouter)

describe("Barrios Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /barrios", () => {
        it("should return all barrios ordered", async () => {
            const mockResponse = [{ idBarrio: 1, nombre: "Barrio Test" }];
            BarriosService.obtenerTodosOrdenados.mockResolvedValue(mockResponse);

            const response = await request(app).get("/barrios");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
        });

        it("should handle server errors", async () => {
            BarriosService.obtenerTodosOrdenados.mockRejectedValue(new Error("Test error"));

            const response = await request(app).get("/barrios");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Error interno del servidor" });
        });
    });
    describe("GET /barrios/:id", () => {
        it("should return a barrio by ID", async () => {
            const mockResponse = { idBarrio: 1, nombre: "Barrio Test" };
            BarriosService.obtenerPorId.mockResolvedValue(mockResponse);

            const response = await request(app).get("/barrios/1");

            expect(BarriosService.obtenerPorId).toHaveBeenCalledWith(1);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
        });

        it("should return 204 if the barrio is not found", async () => {
            BarriosService.obtenerPorId.mockResolvedValue(null);

            const response = await request(app).get("/barrios/999");

            expect(response.status).toBe(204);
        });

        it("should handle invalid ID parameter", async () => {
            const response = await request(app).get("/barrios/invalid");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Parámetro incorrecto..." });
        });
    })
})
