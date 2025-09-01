import * as packageService from "../../services/packageService.js";
import { prisma } from "../../lib/prisma.js";

jest.mock("../../lib/prisma.js", () => ({
  prisma: {
    package: { create: jest.fn(), findMany: jest.fn() },
  },
}));

describe("packageService", () => {
  afterEach(() => jest.clearAllMocks());

  it("deve lançar erro se dados forem incompletos", async () => {
    await expect(packageService.createPackage({})).rejects.toThrow(
      "Dados incompletos: Peso e destino são obrigatórios."
    );
  });

  it("deve criar pacote válido", async () => {
    prisma.package.create.mockResolvedValue({ id: 1, weight: 10 });
    const pkg = await packageService.createPackage({
      weight: 10,
      destinationX: 1,
      destinationY: 1,
      priority: "HIGH",
    });
    expect(pkg.id).toBe(1);
  });

  it("deve retornar pacotes ordenados por prioridade", async () => {
    prisma.package.findMany.mockResolvedValue([
      { id: 1, priority: "LOW" },
      { id: 2, priority: "HIGH" },
    ]);
    const result = await packageService.getAllPackages();
    expect(result[0].priority).toBe("HIGH");
  });
});
