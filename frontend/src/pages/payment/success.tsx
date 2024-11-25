// frontend/src/pages/payment/success.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function PaymentSuccess() {
  const router = useRouter();
  const { orderId } = router.query;
  const [receipt, setReceipt] = useState<string>('');

  useEffect(() => {
    if (orderId) {
      fetchReceipt(orderId as string);
    }
  }, [orderId]);

  const fetchReceipt = async (id: string) => {
    try {
      const response = await fetch(`/api/payment/receipt/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const blob = await response.blob();
      setReceipt(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Error fetching receipt:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <div className="bg-green-100 p-6 rounded-lg mb-4">
        <h1 className="text-2xl font-bold text-green-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-green-700">
          Your order #{orderId} has been processed successfully.
        </p>
      </div>

      {receipt && (
        <a
          href={receipt}
          download={`receipt-${orderId}.pdf`}
          className="inline-block bg-blue-500 text-white py-2 px-4 rounded"
        >
          Download Receipt
        </a>
      )}

      <button
        onClick={() => router.push('/orders')}
        className="block w-full mt-4 bg-gray-200 py-2 px-4 rounded"
      >
        Return to Orders
      </button>
    </div>
  );
}