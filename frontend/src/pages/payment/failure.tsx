// frontend/src/pages/payment/failure.tsx
import React from 'react';
import { useRouter } from 'next/router';

export default function PaymentFailure() {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <div className="bg-red-100 p-6 rounded-lg mb-4">
        <h1 className="text-2xl font-bold text-red-800 mb-2">
          Payment Failed
        </h1>
        <p className="text-red-700">
          {error || 'There was an error processing your payment.'}
        </p>
      </div>

      <button
        onClick={() => router.back()}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Try Again
      </button>
    </div>
  );
}