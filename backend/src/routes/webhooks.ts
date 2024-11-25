// backend/src/routes/webhookRoutes.ts
import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { Order } from '../models/Order';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16'
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

router.post('/stripe-webhook', async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature']!;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            endpointSecret
        );
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).send(`Webhook Error: ${err.message}`);
        } else {
            res.status(400).send('Webhook Error');
        }
        return;
    }

    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await handlePaymentSuccess(paymentIntent);
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object as Stripe.PaymentIntent;
                await handlePaymentFailure(failedPayment);
                break;
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error procesando webhook:', error);
        res.status(500).send('Error interno del servidor');
    }
});

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId;
    const order = await Order.findByPk(orderId);

    if (order) {
        order.status = 'paid';
        (global as any).io.emit('order-paid', {
        await order.save();

        // Emitir evento a través de WebSocket
        global.io.emit('order-paid', {
            orderId: order.id,
            tableNumber: order.tableNumber
        });
    }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId;
    const order = await Order.findByPk(orderId);

        (global as any).io.emit('payment-failed', {
        order.status = 'payment_failed';
        await order.save();

        global.io.emit('payment-failed', {
            orderId: order.id,
            tableNumber: order.tableNumber
        });
    }
}

export default router;