// backend/src/routes/paymentRoutes.ts

import { Router } from 'express';
import { StripeService } from '../services/StripeService';

const router = Router();
const stripeService = new StripeService();

// Ruta para crear un Payment Intent
router.post('/create-payment-intent', async (req, res) => {
    try {
        // Extraer la cantidad del cuerpo de la solicitud
        const { amount } = req.body;

        // Validar que la cantidad sea un número válido
        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount provided.' });
        }

        // Crear el Payment Intent utilizando el servicio de Stripe
        const paymentIntent = await stripeService.createPaymentIntent(amount);

        // Responder con el client_secret necesario para el frontend
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
        console.error('Error creating payment intent:', error);

        // Manejar errores de Stripe específicamente si es necesario
        if (error.type === 'StripeCardError') {
            return res.status(400).json({ error: error.message });
        }

        // Responder con un error genérico en caso de otros problemas
        res.status(500).json({ error: 'An error occurred while creating the payment intent.' });
    }
});

export default router;
