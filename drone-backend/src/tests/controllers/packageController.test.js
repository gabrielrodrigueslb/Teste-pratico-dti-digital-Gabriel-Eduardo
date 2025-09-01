import * as packageController from "../../controllers/packageController.js";
import * as packageService from "../../services/packageService.js";

jest.mock("../../services/packageService.js");

describe("packageController", () => {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  beforeEach(() => jest.clearAllMocks());

  it("getPackages retorna pacotes", async () => {
    packageService.getAllPackages.mockResolvedValue([{ id: 1 }]);
    await packageController.getPackages({ query: {} }, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it("createPackage retorna erro 400 em falha", async () => {
    packageService.createPackage.mockRejectedValue(new Error("fail"));
    await packageController.createPackage({ body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
