// backend/src/routes/table.routes.ts
import { Router } from 'express';
import { TableController } from '../controllers/table.controller';
import { validateTable } from '../middleware/validators';

const router = Router();
const controller = new TableController();

router.post('/', validateTable, controller.create.bind(controller));
router.get('/', controller.findAll.bind(controller));
router.get('/available', controller.checkAvailability.bind(controller));
router.get('/:id', controller.findById.bind(controller));
router.patch('/:id', controller.update.bind(controller));

export default router;