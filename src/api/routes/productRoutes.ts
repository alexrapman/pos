// src/api/routes/productRoutes.ts
import { Router } from 'express';
import { ProductService } from '../../services/ProductService';
import { validateProduct } from '../middleware/validateProduct';

const router = Router();
const productService = new ProductService();

router.post('/', validateProduct, async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        next(error);
    }
});

router.patch('/:id/stock', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { inStock } = req.body;
        const product = await productService.updateStock(id, inStock);
        res.json(product);
    } catch (error) {
        next(error);
    }
});

export { router as productRouter };