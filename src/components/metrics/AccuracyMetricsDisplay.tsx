// src/components/metrics/AccuracyMetricsDisplay.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { PredictionAccuracyService } from '../../services/PredictionAccuracyService';

interface AccuracyMetricsProps {
    actualValues: number[];
    predictedValues: number[];
}

export const AccuracyMetricsDisplay: React.FC<AccuracyMetricsProps> = ({
    actualValues,
    predictedValues
}) => {
    const accuracyService = new PredictionAccuracyService();
    const metrics = accuracyService.calculateAccuracyMetrics(actualValues, predictedValues);

    const MetricCard: React.FC<{ title: string; value: number; format?: string }> = ({
        title,
        value,
        format = '0.00'
    }) => (
        <div className="bg-white rounded-lg shadow p-4">
            <h4 className="text-sm text-gray-500">{title}</h4>
            <div className="text-2xl font-bold mt-1">
                {value.toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
                <MetricCard title="Error Cuadrático Medio" value={metrics.mse} />
                <MetricCard title="Error Absoluto Medio" value={metrics.mae} />
                <MetricCard title="Error Porcentual Medio" value={metrics.mape} />
                <MetricCard title="R² (Coeficiente de Determinación)" value={metrics.r2} />
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-4">Comparativa Predicción vs Real</h3>
                <Line
                    data={{
                        labels: actualValues.map((_, i) => `T${i}`),
                        datasets: [
                            {
                                label: 'Valores Reales',
                                data: actualValues,
                                borderColor: '#3B82F6',
                                fill: false
                            },
                            {
                                label: 'Predicciones',
                                data: predictedValues,
                                borderColor: '#10B981',
                                borderDash: [5, 5],
                                fill: false
                            }
                        ]
                    }}
                    options={{
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};