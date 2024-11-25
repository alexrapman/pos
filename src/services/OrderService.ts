// src/services/OrderService.ts
import { Order, OrderStatus } from '../models/Order';
import { IOrder, IOrderItem } from '../interfaces/IOrder';
import { Product } from '../models/Product';

export class OrderService {
    async createOrder(tableNumber: number, items: IOrderItem[]): Promise<IOrder> {
        const total = await this.calculateTotal(items);

        const order = await Order.create({
            tableNumber,
            items,
            total,
            status: OrderStatus.PENDING
        });

        return order.toJSON();
    }

    async updateOrderStatus(orderId: string, status: OrderStatus): Promise<IOrder> {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');

        order.status = status;
        await order.save();

        return order.toJSON();
    }

    async deleteOrder(orderId: string): Promise<void> {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');

        await order.destroy();
    }

    async getOrder(orderId: string): Promise<IOrder> {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');

        return order.toJSON();
    }

    async getAllOrders(): Promise<IOrder[]> {
        const orders = await Order.findAll();
        return orders.map(order => order.toJSON());
    }

    private async calculateTotal(items: IOrderItem[]): Promise<number> {
        let total = 0;
        for (const item of items) {
            const product = await Product.findByPk(item.productId);
            if (!product) throw new Error(`Product ${item.productId} not found`);
            total += product.price * item.quantity;
        }
        return total;
    }
}