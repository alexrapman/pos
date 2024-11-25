// backend/src/services/payment.service.ts
import Stripe from 'stripe';
import { Order } from '../models/order.model';
import { OrderService } from './order.service';
import { Environment } from '../config/environment';

export class PaymentService {
  private stripe: Stripe;
  private orderService: OrderService;

  constructor() {
    this.stripe = new Stripe(Environment.getInstance().config.stripe.key);
    this.orderService = new OrderService();
  }

  async processPayment(
    orderId: number, 
    paymentMethodId: string
  ): Promise<{ success: boolean; transactionId?: string }> {
    const order = await this.orderService.findById(orderId);
    if (!order) throw new Error('Order not found');

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(order.total * 100),
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true
      });

      if (paymentIntent.status === 'succeeded') {
        await this.orderService.updateOrderStatus(orderId, 'delivered');
        return {
          success: true,
          transactionId: paymentIntent.id
        };
      }

      return { success: false };
    } catch (error) {
      throw new Error(`Payment failed: ${error.message}`);
    }
  }
}