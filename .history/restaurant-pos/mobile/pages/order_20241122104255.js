// mobile/pages/order.js
import React, { useState } from 'react';
import { useQuery } from 'react-query';

export default function Order() {
    const [orderItems, setOrderItems] = useState([]);
    const { data: products, isLoading } = useQuery('products', () =>
        fetch('/api/products').then(res => res.json())
    );

    const addToOrder = (product) => {
        setOrderItems(prev => [...prev, product]);
    };

    const handleSubmit = async () => {
        await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: orderItems })
        });
        alert('Pedido realizado con éxito');
    };

    if (isLoading) return <p>Cargando...</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Realizar Pedido</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                    <div key={product.id} className="p-4 bg-white rounded-lg shadow">
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-gray-600">${product.price}</p>
                        <button
                            onClick={() => addToOrder(product)}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Añadir al Pedido
                        </button>
                    </div>
                ))}
            </div>
            <button
                onClick={handleSubmit}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
            >
                Realizar Pedido
            </button>
        </div>
    );
}