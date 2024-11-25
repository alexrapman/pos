// backend/src/routes/reservationValidation.ts
import { Router } from 'express';
import { ReservationValidationController } from '../controllers/ReservationValidationController';
import { authMiddleware, checkRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { body, param } from 'express-validator';

const router = Router();
const validationController = new ReservationValidationController();

// Validate time slot conflicts
router.post('/check-conflicts',
  authMiddleware,
  [
    body('tableId').isInt(),
    body('startTime').isISO8601(),
    body('endTime').isISO8601(),
    body('excludeId').optional().isInt()
  ],
  validateRequest,
  validationController.checkConflicts
);

// Validate table capacity
router.get('/validate-capacity/:tableId/:partySize',
  authMiddleware,
  [
    param('tableId').isInt(),
    param('partySize').isInt({ min: 1 })
  ],
  validateRequest,
  validationController.validateCapacity
);

// Validate business rules
router.post('/validate-rules',
  authMiddleware,
  [
    body('date').isISO8601(),
    body('duration').isInt({ min: 1, max: 4 }),
    body('partySize').isInt({ min: 1 })
  ],
  validateRequest,
  validationController.validateBusinessRules
);

export default router;