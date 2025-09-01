import { Router } from "express";
import * as allocationController from "../controllers/allocationController.js";

const router = Router();

router.post('/', allocationController.allocatePackages);
router.post('/finalizar', allocationController.triggerCompletion);
router.post('/recarregar', allocationController.triggerRecharge);

export default router;