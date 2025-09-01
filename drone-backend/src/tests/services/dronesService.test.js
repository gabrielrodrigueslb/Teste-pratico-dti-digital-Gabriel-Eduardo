import * as dronesService from "../../services/dronesService.js";
import { prisma } from "../../lib/prisma.js";

jest.mock("../../lib/prisma.js", () => ({
  prisma: {
    drone: { findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
  },
}));

describe("dronesService", () => {
  afterEach(() => jest.clearAllMocks());

  it("getAllAvaibleDrones retorna lista", async () => {
    prisma.drone.findMany.mockResolvedValue([{ id: 1, model: "DJI" }]);
    const drones = await dronesService.getAllAvaibleDrones();
    expect(drones[0].id).toBe(1);
  });

  it("createDrone deve validar campos obrigatórios", async () => {
    await expect(dronesService.createDrone({})).rejects.toThrow(
      "Modelo, peso máximo e distância máxima são obrigatórios."
    );
  });

  it("createDrone cria com sucesso", async () => {
    prisma.drone.create.mockResolvedValue({ id: 1, model: "DJI" });
    const result = await dronesService.createDrone({
      model: "DJI",
      maxWeight: 100,
      maxDistance: 50,
    });
    expect(result.id).toBe(1);
  });

  it("updateDrone atualiza", async () => {
    prisma.drone.update.mockResolvedValue({ id: 1, model: "Editado" });
    const result = await dronesService.updateDrone(1, { model: "Editado" });
    expect(result.model).toBe("Editado");
  });
});
