// frontend/src/components/inventory/CreatePurchaseOrderModal.tsx
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';

interface CreatePurchaseOrderProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export const CreatePurchaseOrderModal: React.FC<CreatePurchaseOrderProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [supplierId, setSupplierId] = useState<number>(0);

  const { data: suppliers } = useQuery('suppliers', async () => {
    const response = await fetch('/api/inventory/suppliers');
    return response.json();
  });

  const { data: products } = useQuery('products', async () => {
    const response = await fetch('/api/inventory/products');
    return response.json();
  });

  const createOrder = useMutation(
    async (orderData: any) => {
      const response = await fetch('/api/inventory/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });
      return response.json();
    },
    {
      onSuccess: () => {
        onSuccess();
        onClose();
      }
    }
  );

  const addItem = () => {
    setItems([...items, { productId: 0, quantity: 1, price: 0 }]);
  };

  const updateItem = (index: number, field: keyof OrderItem, value: number) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Create Purchase Order</h2>

        <div className="mb-4">
          <label className="block mb-2">Supplier</label>
          <select
            value={supplierId}
            onChange={(e) => setSupplierId(Number(e.target.value))}
            className="w-full border rounded p-2"
          >
            <option value={0}>Select Supplier</option>
            {suppliers?.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <h3 className="font-bold mb-2">Order Items</h3>
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <select
                value={item.productId}
                onChange={(e) => updateItem(index, 'productId', Number(e.target.value))}
                className="flex-1 border rounded p-2"
              >
                <option value={0}>Select Product</option>
                {products?.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                className="w-20 border rounded p-2"
                min="1"
              />
              <input
                type="number"
                value={item.price}
                onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                className="w-24 border rounded p-2"
                step="0.01"
                min="0"
              />
            </div>
          ))}
          <button
            onClick={addItem}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Add Item
          </button>
        </div>

        <div className="text-right mb-4">
          <span className="font-bold">Total: ${calculateTotal().toFixed(2)}</span>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => createOrder.mutate({
              supplierId,
              items,
              totalAmount: calculateTotal()
            })}
            disabled={!supplierId || items.length === 0}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
};