import * as dronesController from "../../controllers/dronesController.js";
import * as dronesService from "../../services/dronesService.js";

jest.mock("../../services/dronesService.js");

describe("dronesController", () => {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  beforeEach(() => jest.clearAllMocks());

  it("retorna lista de drones disponíveis", async () => {
    dronesService.getAllAvaibleDrones.mockResolvedValue([{ id: 1, model: "DJI" }]);
    await dronesController.allAvaibleDrones({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, model: "DJI" }]);
  });

  it("retorna erro 500 se service falhar", async () => {
    dronesService.getAllAvaibleDrones.mockRejectedValue(new Error("fail"));
    await dronesController.allAvaibleDrones({}, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Erro ao buscar drones disponíveis." });
  });
});