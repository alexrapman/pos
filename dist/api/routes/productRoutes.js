"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
// src/api/routes/productRoutes.ts
const express_1 = require("express");
const ProductService_1 = require("../../services/ProductService");
const validateProduct_1 = require("../middleware/validateProduct");
const router = (0, express_1.Router)();
exports.productRouter = router;
const productService = new ProductService_1.ProductService();
router.post('/', validateProduct_1.validateProduct, async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    }
    catch (error) {
        next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    }
    catch (error) {
        next(error);
    }
});
router.patch('/:id/stock', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { inStock } = req.body;
        const product = await productService.updateStock(id, inStock);
        res.json(product);
    }
    catch (error) {
        next(error);
    }
});
