"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
// src/services/ProductService.ts
const Product_1 = require("../models/Product");
class ProductService {
    async createProduct(productData) {
        const product = await Product_1.Product.create(productData);
        return product.toJSON();
    }
    async updateProduct(id, productData) {
        const product = await Product_1.Product.findByPk(id);
        if (!product)
            throw new Error('Product not found');
        await product.update(productData);
        return product.toJSON();
    }
    async deleteProduct(id) {
        const product = await Product_1.Product.findByPk(id);
        if (!product)
            throw new Error('Product not found');
        await product.destroy();
    }
    async getProduct(id) {
        const product = await Product_1.Product.findByPk(id);
        if (!product)
            throw new Error('Product not found');
        return product.toJSON();
    }
    async getAllProducts() {
        const products = await Product_1.Product.findAll();
        return products.map(product => product.toJSON());
    }
    async updateStock(id, inStock) {
        const product = await Product_1.Product.findByPk(id);
        if (!product)
            throw new Error('Product not found');
        product.inStock = inStock;
        await product.save();
        return product.toJSON();
    }
}
exports.ProductService = ProductService;
