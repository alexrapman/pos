// src/services/ProductService.ts
import { Product } from '../models/Product';
import { IProduct } from '../interfaces/IProduct';

export class ProductService {
    async createProduct(productData: Omit<IProduct, 'id'>): Promise<IProduct> {
        const product = await Product.create(productData);
        return product.toJSON();
    }

    async updateProduct(id: string, productData: Partial<IProduct>): Promise<IProduct> {
        const product = await Product.findByPk(id);
        if (!product) throw new Error('Product not found');

        await product.update(productData);
        return product.toJSON();
    }

    async deleteProduct(id: string): Promise<void> {
        const product = await Product.findByPk(id);
        if (!product) throw new Error('Product not found');

        await product.destroy();
    }

    async getProduct(id: string): Promise<IProduct> {
        const product = await Product.findByPk(id);
        if (!product) throw new Error('Product not found');

        return product.toJSON();
    }

    async getAllProducts(): Promise<IProduct[]> {
        const products = await Product.findAll();
        return products.map(product => product.toJSON());
    }

    async updateStock(id: string, inStock: boolean): Promise<IProduct> {
        const product = await Product.findByPk(id);
        if (!product) throw new Error('Product not found');

        product.inStock = inStock;
        await product.save();

        return product.toJSON();
    }
}