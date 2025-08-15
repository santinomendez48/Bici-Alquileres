import barrioRepository from "../../repositories/barrioRepository";
import {jest} from "@jest/globals";
import {describe, it, expect, afterEach} from "@jest/globals";
import BarriosService from "../../services/barrios.service.js";

jest.mock("../../repositories/barriorepository.js");
barrioRepository.obtenerTodosOrdenados = jest.fn();
barrioRepository.obtenerPorId = jest.fn();

describe("BarriosService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("obtenerTodosOrdenados", () => {
        it("should return all barrios ordered", async () => {
            const mockResponse = [{ idBarrio: 1, nombre: "Barrio Test" }];
            barrioRepository.obtenerTodosOrdenados.mockResolvedValue(mockResponse);

            const result = await BarriosService.obtenerTodosOrdenados();

            expect(barrioRepository.obtenerTodosOrdenados).toHaveBeenCalled();
            expect(result).toEqual(mockResponse);
        });
        it("should handle server errors", async () => {
            barrioRepository.obtenerTodosOrdenados.mockRejectedValue(new Error("Test error"));

            await expect(BarriosService.obtenerTodosOrdenados()).rejects.toThrow("Test error");
        });
    });

    describe("obtenerPorId", () => {
        it("should return a barrio by ID", async () => {
            const mockResponse = { idBarrio: 1, nombre: "Barrio Test" };
            barrioRepository.obtenerPorId.mockResolvedValue(mockResponse);

            const result = await BarriosService.obtenerPorId(1);

            expect(barrioRepository.obtenerPorId).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockResponse);
        });

        it("should return null if the barrio is not found", async () => {
            barrioRepository.obtenerPorId.mockResolvedValue(null);

            const result = await BarriosService.obtenerPorId(999);

            expect(barrioRepository.obtenerPorId).toHaveBeenCalledWith(999);
            expect(result).toBeNull();
        });
    });
})
