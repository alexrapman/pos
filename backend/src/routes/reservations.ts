// backend/src/routes/reservations.ts - Updated
import { Router } from 'express';
import { ReservationController } from '../controllers/ReservationController';
import { ReservationValidators } from '../validators/ReservationValidators';
import { ValidationMiddleware } from '../middleware/validationMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const controller = new ReservationController();

router.post('/',
  authMiddleware,
  ValidationMiddleware.validate(ReservationValidators.createReservation()),
  controller.create
);

router.get('/',
  authMiddleware,
  ValidationMiddleware.validate(ReservationValidators.queryReservations()),
  controller.list
);

router.patch('/:id',
  authMiddleware,
  ValidationMiddleware.validate(ReservationValidators.updateReservation()),
  controller.update
);

router.post('/validate-slot',
  authMiddleware,
  ValidationMiddleware.validate(ReservationValidators.validateTimeSlot()),
  controller.validateTimeSlot
);

export default router;