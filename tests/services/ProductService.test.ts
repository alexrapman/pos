// tests/services/ProductService.test.ts
import { ProductService } from '../../src/services/ProductService';
import { Product } from '../../src/models/Product';
import sequelize from '../../src/config/database';

describe('ProductService', () => {
    const productService = new ProductService();

    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterEach(async () => {
        await Product.destroy({ where: {} });
    });

    describe('createProduct', () => {
        it('should create a new product', async () => {
            const productData = {
                name: 'Test Product',
                price: 9.99,
                category: 'Test',
                inStock: true
            };

            const product = await productService.createProduct(productData);

            expect(product).toMatchObject(productData);
            expect(product.id).toBeDefined();
        });
    });

    describe('updateProduct', () => {
        it('should update an existing product', async () => {
            const product = await Product.create({
                name: 'Original Name',
                price: 9.99,
                category: 'Test',
                inStock: true
            });

            const updated = await productService.updateProduct(product.id, {
                name: 'Updated Name'
            });

            expect(updated.name).toBe('Updated Name');
        });

        it('should throw error if product not found', async () => {
            await expect(
                productService.updateProduct('non-existent-id', {})
            ).rejects.toThrow('Product not found');
        });
    });
});