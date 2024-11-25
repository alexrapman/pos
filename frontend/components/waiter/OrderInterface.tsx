// frontend/components/waiter/OrderInterface.tsx
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Product } from '../../types';

interface OrderItem {
    productId: string;
    quantity: number;
    notes?: string;
}

export const OrderInterface: React.FC = () => {
    const [selectedTable, setSelectedTable] = useState<number>(0);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

    const { data: products } = useQuery<Product[]>('products',
        () => fetch('/api/products').then(res => res.json())
    );

    const addToOrder = (product: Product) => {
        setOrderItems(prev => {
            const existing = prev.find(item => item.productId === product.id);
            if (existing) {
                return prev.map(item =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { productId: product.id, quantity: 1 }];
        });
    };

    return (
        <div className="h-screen flex">
            {/* Panel izquierdo: Selección de mesa */}
            <div className="w-1/4 bg-gray-100 p-4">
                <h2 className="text-xl font-bold mb-4">Seleccionar Mesa</h2>
                <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 12 }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedTable(i + 1)}
                            className={`
                                p-4 rounded-lg text-center
                                ${selectedTable === i + 1
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white'}
                            `}
                        >
                            Mesa {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Panel central: Menú */}
            <div className="w-2/4 p-4">
                <h2 className="text-xl font-bold mb-4">Menú</h2>
                <div className="grid grid-cols-2 gap-4">
                    {products?.map(product => (
                        <button
                            key={product.id}
                            onClick={() => addToOrder(product)}
                            className="p-4 bg-white rounded-lg shadow"
                        >
                            <h3 className="font-bold">{product.name}</h3>
                            <p className="text-gray-600">${product.price}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Panel derecho: Orden actual */}
            <div className="w-1/4 bg-gray-100 p-4">
                <h2 className="text-xl font-bold mb-4">
                    Orden - Mesa {selectedTable}
                </h2>
                <div className="space-y-2">
                    {orderItems.map((item, index) => (
                        <div key={index} className="flex justify-between bg-white p-2 rounded">
                            <span>{products?.find(p => p.id === item.productId)?.name}</span>
                            <span>x{item.quantity}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};