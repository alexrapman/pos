// frontend/components/payment/CheckoutForm.tsx
import React, { useState } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements
} from '@stripe/stripe-react-js';

export const CheckoutForm: React.FC<{ amount: number }> = ({ amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);

        const { error: submitError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment-complete`,
            },
        });

        if (submitError) {
            setError(submitError.message || 'Error al procesar el pago');
        }

        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            {error && (
                <div className="text-red-500 text-sm">{error}</div>
            )}
            <button
                type="submit"
                disabled={!stripe || processing}
                className={`
                    w-full py-2 px-4 rounded
                    ${processing
                        ? 'bg-gray-400'
                        : 'bg-blue-500 hover:bg-blue-600'}
                    text-white font-medium
                `}
            >
                {processing ? 'Procesando...' : `Pagar ${amount}€`}
            </button>
        </form>
    );
};