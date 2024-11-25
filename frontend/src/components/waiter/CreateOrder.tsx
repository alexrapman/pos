// frontend/src/components/waiter/CreateOrder.tsx
import React, { useState, useEffect } from 'react';
import { socketService } from '../../services/socket';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

export const CreateOrder: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addItem = (product: Product) => {
    setOrderItems(prev => {
      const existingItem = prev.find(item => item.productId === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        quantity: 1,
        price: product.price
      }];
    });
  };

  const removeItem = (productId: number) => {
    setOrderItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setOrderItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber: parseInt(tableNumber),
          items: orderItems,
          total: calculateTotal()
        })
      });
      const newOrder = await response.json();
      socketService.emitKitchenUpdate(newOrder);
      setOrderItems([]);
      setTableNumber('');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      <div>
        <div className="mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All Categories</option>
            {Array.from(new Set(products.map(p => p.category))).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {products
            .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
            .map(product => (
              <button
                key={product.id}
                onClick={() => addItem(product)}
                className="p-2 border rounded hover:bg-gray-100"
              >
                <div>{product.name}</div>
                <div className="text-sm text-gray-600">${product.price}</div>
              </button>
            ))}
        </div>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="Table Number"
            required
            className="w-full border p-2 rounded mb-4"
          />
          <div className="border rounded p-4 mb-4">
            {orderItems.map(item => (
              <div key={item.productId} className="flex justify-between items-center mb-2">
                <span>{item.name}</span>
                <div>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="px-2 py-1 border rounded"
                  >-</button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="px-2 py-1 border rounded"
                  >+</button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="ml-2 text-red-500"
                  >×</button>
                </div>
              </div>
            ))}
            <div className="text-right font-bold">
              Total: ${calculateTotal()}
            </div>
          </div>
          <button
            type="submit"
            disabled={!tableNumber || orderItems.length === 0}
            className="w-full bg-blue-500 text-white py-2 rounded disabled:bg-gray-300"
          >
            Create Order
          </button>
        </form>
      </div>
    </div>
  );
};