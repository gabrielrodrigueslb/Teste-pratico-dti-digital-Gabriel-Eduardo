import * as allocationService from "../../services/allocationService.js";
import * as packageService from "../../services/packageService.js";
import { prisma } from "../../lib/prisma.js";

jest.mock("../../services/packageService.js");
jest.mock("../../lib/prisma.js", () => ({
  prisma: {
    drone: { findMany: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
    package: { updateMany: jest.fn(), findMany: jest.fn() },
    $transaction: jest.fn(),
  },
}));

describe("allocationService", () => {
  afterEach(() => jest.clearAllMocks());

  it("deve retornar mensagem se nenhum drone estiver disponível", async () => {
    packageService.getAllPackages.mockResolvedValue([]);
    prisma.drone.findMany.mockResolvedValue([]);

    const result = await allocationService.allocatePackages();
    expect(result).toEqual({
      message: "Nenhum drone disponível com bateria suficiente para alocação.",
    });
  });

  it("deve alocar pacotes quando drones estão disponíveis", async () => {
    packageService.getAllPackages.mockResolvedValue([
      { id: 1, weight: 2, destinationX: 1, destinationY: 1 },
    ]);

    prisma.drone.findMany.mockResolvedValue([
      { id: 10, model: "DJI", maxWeight: 10, maxDistance: 50, battery: 100, status: "IDLE" },
    ]);

    prisma.$transaction.mockResolvedValue();

    const result = await allocationService.allocatePackages();
    expect(result.message).toBe("Alocação otimizada concluída.");
    expect(result.details[0]).toContain("Drone #10");
  });
});