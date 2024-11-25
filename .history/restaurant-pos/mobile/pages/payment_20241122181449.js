// mobile/pages/payment.js
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

export default function Payment() {
    const [amount, setAmount] = useState('');
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error, paymentIntent } = await stripe.createPayment({
            amount: parseInt(amount) * 100,
            currency: 'eur',
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: 'Cliente'
                }
            }
        });

        if (error) {
            alert(error.message);
        } else {
            alert('Pago realizado con éxito');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Realizar Pago</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Monto</label>
                    <input
                        type="number"
                        name="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Tarjeta</label>
                    <CardElement className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                >
                    Pagar
                </button>
            </form>
        </div>
    );
}