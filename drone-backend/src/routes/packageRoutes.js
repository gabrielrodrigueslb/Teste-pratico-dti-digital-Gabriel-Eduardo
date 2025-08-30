import {Router} from 'express';
import * as packageController from '../controllers/packageController.js';

const router = Router();

// Cria uma nova rota para criar pacotes
router.post('/', packageController.createPackage);

router.get('/', packageController.getPendingPackages);

export default router