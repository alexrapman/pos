// frontend/src/components/waiter/OrderStatus.tsx
import React, { useState, useEffect } from 'react';
import { useOrderSocket } from '../../hooks/useSocket';
import { toast } from 'react-toastify';

interface OrderStatusProps {
  orderId: number;
  initialStatus: string;
  tableNumber: number;
}

export const OrderStatus: React.FC<OrderStatusProps> = ({
  orderId,
  initialStatus,
  tableNumber,
}) => {
  const [status, setStatus] = useState(initialStatus);

  useOrderSocket(orderId, (data) => {
    setStatus(data.status);
    toast.info(`Order ${orderId} status updated to ${data.status}`);
  });

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100',
      preparing: 'bg-blue-100',
      ready: 'bg-green-100',
      delivered: 'bg-gray-100'
    };
    return colors[status] || 'bg-gray-100';
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Table {tableNumber}</h3>
          <p className="text-sm text-gray-600">Order #{orderId}</p>
        </div>
        <span className={`px-3 py-1 rounded-full ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>
      {status === 'ready' && (
        <button
          onClick={async () => {
            await fetch(`/api/orders/${orderId}/status`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'delivered' })
            });
          }}
          className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Mark as Delivered
        </button>
      )}
    </div>
  );
};