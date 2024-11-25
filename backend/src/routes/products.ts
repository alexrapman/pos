// backend/src/routes/products.ts
import { Router } from 'express'
import { Product } from '../models/Product'

const router = Router()

router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll()
        res.json(products)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' })
    }
})

router.post('/', async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(201).json(product)
    } catch (error) {
        res.status(400).json({ error: 'Failed to create product' })
    }
})

export default router