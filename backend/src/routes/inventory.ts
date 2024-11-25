// backend/src/routes/inventory.ts
import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController';
import { authMiddleware, checkRole } from '../middleware/auth';

const router = Router();
const inventoryController = new InventoryController();

router.use(authMiddleware);
router.use(checkRole(['admin', 'manager']));

router.post('/stock/update', inventoryController.updateStock.bind(inventoryController));
router.get('/alerts', inventoryController.getStockAlerts.bind(inventoryController));
router.get('/purchase-orders', inventoryController.getPurchaseOrders.bind(inventoryController));

export default router;