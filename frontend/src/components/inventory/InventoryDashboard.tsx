// frontend/src/components/inventory/InventoryDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';

interface Product {
  id: number;
  name: string;
  stock: number;
  minStock: number;
  supplier: string;
}

interface PurchaseOrder {
  id: number;
  supplierId: number;
  status: 'pending' | 'approved' | 'received';
  totalAmount: number;
}

export const InventoryDashboard: React.FC = () => {
  const [filter, setFilter] = useState('all');

  const { data: products, isLoading } = useQuery('products', async () => {
    const response = await fetch('/api/inventory/products');
    return response.json();
  });

  const { data: alerts } = useQuery('stockAlerts', async () => {
    const response = await fetch('/api/inventory/alerts');
    return response.json();
  });

  const handleStockUpdate = async (productId: number, quantity: number, type: 'in' | 'out') => {
    try {
      await fetch('/api/inventory/stock/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId,
          quantity,
          type,
          reason: 'Manual adjustment'
        })
      });
      toast.success('Stock updated successfully');
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Products</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {alerts?.length > 0 && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
          <h2 className="text-red-700 font-bold">Low Stock Alerts</h2>
          <ul>
            {alerts.map(alert => (
              <li key={alert.id}>{alert.name} - Current stock: {alert.stock}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Product</th>
              <th className="px-6 py-3 text-left">Current Stock</th>
              <th className="px-6 py-3 text-left">Supplier</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map(product => (
              <tr key={product.id} className="border-t">
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">{product.supplier}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleStockUpdate(product.id, 1, 'in')}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleStockUpdate(product.id, 1, 'out')}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    -
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};