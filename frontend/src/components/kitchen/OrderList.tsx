// frontend/src/components/kitchen/OrderList.tsx
import React, { useState, useEffect } from 'react';
import { useKitchenSocket } from '../../hooks/useSocket';

interface Order {
  id: number;
  tableNumber: number;
  status: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
}

export const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useKitchenSocket((newOrder: Order) => {
    setOrders(prev => [...prev, newOrder]);
  });

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Kitchen Orders</h2>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Table {order.tableNumber}</h3>
              <span className="px-2 py-1 rounded bg-yellow-100">
                {order.status}
              </span>
            </div>
            <ul className="mt-2">
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.quantity}x {item.name}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => updateOrderStatus(order.id, 'preparing')}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Start Preparing
              </button>
              <button
                onClick={() => updateOrderStatus(order.id, 'ready')}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Mark Ready
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};