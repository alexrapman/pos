// frontend/src/components/payment/PaymentForm.tsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

interface PaymentFormProps {
  orderId: number;
  amount: number;
}

const PaymentFormContent: React.FC<PaymentFormProps> = ({ orderId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    
    try {
      // Get payment intent from backend
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ orderId })
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      });

      if (stripeError) {
        setError(stripeError.message!);
      } else {
        window.location.href = `/payment/success?orderId=${orderId}`;
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Payment Details</h2>
        <p className="text-gray-600">Amount to pay: €{amount.toFixed(2)}</p>
      </div>

      <div className="mb-4">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="mb-4 text-red-500">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-300"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export const PaymentForm: React.FC<PaymentFormProps> = (props) => (
  <Elements stripe={stripePromise}>
    <PaymentFormContent {...props} />
  </Elements>
);