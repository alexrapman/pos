// frontend/src/components/waiter/WaiterOrderList.tsx
import React, { useState, useEffect } from 'react';
import { OrderStatus } from './OrderStatus';
import { useKitchenSocket } from '../../hooks/useSocket';

interface Order {
  id: number;
  tableNumber: number;
  status: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

export const WaiterOrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTable, setSearchTable] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useKitchenSocket((data) => {
    setOrders(prev => prev.map(order => 
      order.id === data.orderId 
        ? { ...order, status: data.status }
        : order
    ));
  });

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const filteredOrders = orders
    .filter(order => filter === 'all' || order.status === filter)
    .filter(order => 
      searchTable === '' || 
      order.tableNumber.toString().includes(searchTable)
    );

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="delivered">Delivered</option>
        </select>
        <input
          type="text"
          placeholder="Search by table..."
          value={searchTable}
          onChange={(e) => setSearchTable(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <OrderStatus
            key={order.id}
            orderId={order.id}
            initialStatus={order.status}
            tableNumber={order.tableNumber}
          />
        ))}
      </div>
    </div>
  );
};