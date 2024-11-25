// mobile/pages/recommendations.js
import React from 'react';
import { useQuery } from 'react-query';

export default function Recommendations() {
    const { data: recommendations, isLoading } = useQuery('recommendations', () =>
        fetch('/api/chef-virtual/recommendations', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => res.json())
    );

    if (isLoading) return <p>Cargando...</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Recomendaciones del Chef</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map(recommendation => (
                    <div key={recommendation.id} className="p-4 bg-white rounded-lg shadow">
                        <h3 className="font-bold">{recommendation.product.name}</h3>
                        <p className="text-gray-600">{recommendation.tips}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}