// frontend/components/payment/PaymentHandler.tsx
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/stripe-react-js';
import { CheckoutForm } from './CheckoutForm';
import { useSocket } from '../../hooks/useSocket';
import { toast } from 'react-toastify';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

interface PaymentHandlerProps {
    orderId: string;
    amount: number;
    onPaymentComplete: () => void;
}

export const PaymentHandler: React.FC<PaymentHandlerProps> = ({
    orderId,
    amount,
    onPaymentComplete
}) => {
    const [clientSecret, setClientSecret] = useState('');
    const socket = useSocket();

    useEffect(() => {
        // Obtener el clientSecret de Stripe
        fetch('/api/payments/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, orderId })
        })
            .then(res => res.json())
            .then(data => setClientSecret(data.clientSecret));

        // Escuchar eventos de pago
        socket.on('order-paid', (data) => {
            if (data.orderId === orderId) {
                toast.success('¡Pago completado con éxito!');
                onPaymentComplete();
            }
        });

        socket.on('payment-failed', (data) => {
            if (data.orderId === orderId) {
                toast.error('Error en el pago. Por favor, intente nuevamente.');
            }
        });

        return () => {
            socket.off('order-paid');
            socket.off('payment-failed');
        };
    }, [orderId, amount, socket, onPaymentComplete]);

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Pagar Pedido</h2>
            {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm amount={amount} />
                </Elements>
            )}
        </div>
    );
};