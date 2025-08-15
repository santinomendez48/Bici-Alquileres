import EstacionesService from "../../services/estaciones.service.js";
import EstacionRepository from "../../repositories/estacionRepository.js";
import { jest } from "@jest/globals";
import { describe, it, expect, afterEach } from "@jest/globals";

jest.mock("../../repositories/estacionRepository.js");
EstacionRepository.buscarConFiltros = jest.fn();
EstacionRepository.obtenerPorIdConBarrio = jest.fn();

describe("EstacionesService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("buscarConFiltros", () => {
    it("should return filtered stations from the repository", async () => {
      const mockFilters = { texto: "test", barrioId: 1, incluyeInactivos: true };
      const mockResponse = [{ id: 1, name: "Estación Test" }];
      EstacionRepository.buscarConFiltros.mockResolvedValue(mockResponse);

      const result = await EstacionesService.buscarConFiltros(mockFilters);

      expect(EstacionRepository.buscarConFiltros).toHaveBeenCalledWith(mockFilters);
      expect(result).toEqual(mockResponse);
    });

    it("should handle empty results", async () => {
      const mockFilters = { texto: "", barrioId: -1, incluyeInactivos: false };
      EstacionRepository.buscarConFiltros.mockResolvedValue([]);

      const result = await EstacionesService.buscarConFiltros(mockFilters);

      expect(EstacionRepository.buscarConFiltros).toHaveBeenCalledWith(mockFilters);
      expect(result).toEqual([]);
    });
  });

  describe("obtenerPorIdConBarrio", () => {
    it("should return a station by ID from the repository", async () => {
      const mockId = 1;
      const mockResponse = { id: 1, name: "Estación Test", barrio: "Barrio Test" };
      EstacionRepository.obtenerPorIdConBarrio.mockResolvedValue(mockResponse);

      const result = await EstacionesService.obtenerPorIdConBarrio(mockId);

      expect(EstacionRepository.obtenerPorIdConBarrio).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockResponse);
    });

    it("should return null if the station is not found", async () => {
      const mockId = 999;
      EstacionRepository.obtenerPorIdConBarrio.mockResolvedValue(null);

      const result = await EstacionesService.obtenerPorIdConBarrio(mockId);

      expect(EstacionRepository.obtenerPorIdConBarrio).toHaveBeenCalledWith(mockId);
      expect(result).toBeNull();
    });
  });
});
