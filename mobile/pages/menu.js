// mobile/pages/menu.js
import React from 'react';
import { useQuery } from 'react-query';

export default function Menu() {
    const { data: products, isLoading } = useQuery('products', () =>
        fetch('/api/products').then(res => res.json())
    );

    if (isLoading) return <p>Cargando...</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Menú</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                    <div key={product.id} className="p-4 bg-white rounded-lg shadow">
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-gray-600">${product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}