"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/api/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const orderRoutes_1 = require("./routes/orderRoutes");
const productRoutes_1 = require("./routes/productRoutes");
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/orders', orderRoutes_1.orderRouter);
app.use('/api/products', productRoutes_1.productRouter);
app.use(errorHandler_1.errorHandler);
exports.default = app;
