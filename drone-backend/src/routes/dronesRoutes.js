import { Router } from "express";
import * as dronesController from "../controllers/dronesController.js";

const router = Router();

router.get('/', dronesController.allAvaibleDrones);
router.post('/', dronesController.createDrone);
router.put('/:id', dronesController.updateDrone);

export default router;
