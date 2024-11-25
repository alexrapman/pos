// backend/src/services/StripeService.ts
import Stripe from 'stripe';

export class StripeService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2023-10-16'
        });
    }

    async createPaymentIntent(amount: number): Promise<Stripe.PaymentIntent> {
        return await this.stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convertir a centavos
            currency: 'eur',
            automatic_payment_methods: {
                enabled: true
            }
        });
    }
}