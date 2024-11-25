// tests/services/OrderService.test.ts
import { OrderService } from '../../src/services/OrderService';
import { ProductService } from '../../src/services/ProductService';
import { Order } from '../../src/models/Order';
import { Product } from '../../src/models/Product';
import { OrderStatus } from '../../src/interfaces/IOrder';
import sequelize from '../../src/config/database';

describe('OrderService', () => {
    const orderService = new OrderService();
    const productService = new ProductService();
    let testProduct: any;

    beforeAll(async () => {
        await sequelize.sync({ force: true });
        testProduct = await productService.createProduct({
            name: 'Test Product',
            price: 10.00,
            category: 'Test',
            inStock: true
        });
    });

    afterEach(async () => {
        await Order.destroy({ where: {} });
    });

    describe('createOrder', () => {
        it('should create a new order with correct total', async () => {
            const orderItems = [{
                productId: testProduct.id,
                quantity: 2,
                price: testProduct.price
            }];

            const order = await orderService.createOrder(1, orderItems);

            expect(order.tableNumber).toBe(1);
            expect(order.total).toBe(20.00);
            expect(order.status).toBe(OrderStatus.PENDING);
        });

        it('should throw error if product not found', async () => {
            const orderItems = [{
                productId: 'non-existent-id',
                quantity: 1,
                price: 10.00
            }];

            await expect(
                orderService.createOrder(1, orderItems)
            ).rejects.toThrow('Product non-existent-id not found');
        });
    });

    describe('updateOrderStatus', () => {
        it('should update order status', async () => {
            const order = await orderService.createOrder(1, [{
                productId: testProduct.id,
                quantity: 1,
                price: testProduct.price
            }]);

            const updated = await orderService.updateOrderStatus(
                order.id,
                OrderStatus.PREPARING
            );

            expect(updated.status).toBe(OrderStatus.PREPARING);
        });
    });
});