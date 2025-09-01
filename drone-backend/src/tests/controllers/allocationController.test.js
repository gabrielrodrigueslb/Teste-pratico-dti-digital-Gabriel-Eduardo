import * as allocationController from "../../controllers/allocationController.js";
import * as allocationService from "../../services/allocationService.js";

jest.mock("../../services/allocationService.js");

describe("allocationController", () => {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  beforeEach(() => jest.clearAllMocks());

  it("allocatePackages retorna sucesso", async () => {
    allocationService.allocatePackages.mockResolvedValue({ message: "ok" });
    await allocationController.allocatePackages({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "ok" });
  });

  it("triggerCompletion trata erro", async () => {
    allocationService.completeDeliveries.mockRejectedValue(new Error("x"));
    await allocationController.triggerCompletion({}, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});