// frontend/src/components/inventory/PurchaseOrders.tsx
import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';

interface PurchaseOrder {
  id: number;
  supplierId: number;
  status: 'pending' | 'approved' | 'received';
  totalAmount: number;
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
}

export const PurchaseOrders: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: orders, refetch } = useQuery('purchaseOrders', async () => {
    const response = await fetch('/api/inventory/purchase-orders');
    return response.json();
  });

  const updateOrderStatus = useMutation(
    async ({ orderId, status }: { orderId: number; status: string }) => {
      await fetch(`/api/inventory/purchase-orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
    },
    {
      onSuccess: () => {
        refetch();
      }
    }
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Purchase Orders</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create New Order
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Order ID</th>
              <th className="px-6 py-3 text-left">Supplier</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Total Amount</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order: PurchaseOrder) => (
              <tr key={order.id} className="border-t">
                <td className="px-6 py-4">#{order.id}</td>
                <td className="px-6 py-4">{order.supplierId}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded ${
                    order.status === 'received' 
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'approved'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">${order.totalAmount}</td>
                <td className="px-6 py-4">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus.mutate({
                        orderId: order.id,
                        status: 'approved'
                      })}
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Approve
                    </button>
                  )}
                  {order.status === 'approved' && (
                    <button
                      onClick={() => updateOrderStatus.mutate({
                        orderId: order.id,
                        status: 'received'
                      })}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Mark Received
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};