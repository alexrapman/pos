// mobile/pages/reports.js
import React, { useState } from 'react';
import { useQuery } from 'react-query';

export default function Reports() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { data: report, refetch } = useQuery(
        ['salesReport', startDate, endDate],
        () =>
            fetch(`/api/reports/sales?startDate=${startDate}&endDate=${endDate}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(res => res.json()),
        { enabled: false }
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        refetch();
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Reportes de Ventas</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium">Fecha de Inicio</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Fecha de Fin</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Generar Reporte
                </button>
            </form>
            {report && (
                <div>
                    <h2 className="text-xl font-bold mb-4">Resultados</h2>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pedido</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {report.map((order) => (
                                <tr key={order.orderId}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}