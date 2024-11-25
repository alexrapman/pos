"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
// src/api/routes/orderRoutes.ts
const express_1 = require("express");
const OrderController_1 = require("../controllers/OrderController");
const permissionMiddleware_1 = require("../middleware/permissionMiddleware");
const permissions_1 = require("../config/permissions");
const router = (0, express_1.Router)();
exports.orderRouter = router;
const orderController = new OrderController_1.OrderController();
router.post('/', (0, permissionMiddleware_1.requirePermission)(permissions_1.Permissions.ORDER.CREATE), orderController.createOrder.bind(orderController));
router.patch('/:id/status', (0, permissionMiddleware_1.requirePermission)(permissions_1.Permissions.ORDER.UPDATE), orderController.updateOrderStatus.bind(orderController));
router.get('/:id', (0, permissionMiddleware_1.requirePermission)(permissions_1.Permissions.ORDER.VIEW), orderController.getOrder.bind(orderController));
router.get('/', (0, permissionMiddleware_1.requirePermission)(permissions_1.Permissions.ORDER.VIEW), orderController.getAllOrders.bind(orderController));
