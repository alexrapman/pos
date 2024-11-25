// src/components/metrics/PredictiveTrendChart.tsx
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { TrendPredictionService } from '../../services/TrendPredictionService';
import { MetricFormatters } from '../../utils/metricFormatters';

interface PredictiveTrendProps {
    historicalData: number[];
    title: string;
    metricType: 'bytes' | 'percent';
    predictionPeriods?: number;
}

export const PredictiveTrendChart: React.FC<PredictiveTrendProps> = ({
    historicalData,
    title,
    metricType,
    predictionPeriods = 5
}) => {
    const [predictions, setPredictions] = useState<{
        values: number[];
        confidence: number[];
    }>({ values: [], confidence: [] });

    const predictionService = new TrendPredictionService();

    useEffect(() => {
        const { predictions, confidenceInterval } = predictionService.predictNextValues(
            historicalData,
            predictionPeriods
        );
        setPredictions({ values: predictions, confidence: confidenceInterval });
    }, [historicalData, predictionPeriods]);

    const datasets = [
        {
            label: 'Histórico',
            data: historicalData,
            borderColor: '#3B82F6',
            fill: false
        },
        {
            label: 'Predicción',
            data: [...Array(historicalData.length).fill(null), ...predictions.values],
            borderColor: '#9CA3AF',
            borderDash: [5, 5],
            fill: false
        },
        {
            label: 'Intervalo de Confianza',
            data: [...Array(historicalData.length).fill(null), ...predictions.confidence],
            backgroundColor: 'rgba(156, 163, 175, 0.2)',
            fill: true,
            pointRadius: 0
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <Line
                data={{
                    labels: [
                        ...historicalData.map((_, i) => `T${i}`),
                        ...predictions.values.map((_, i) => `T${historicalData.length + i}`)
                    ],
                    datasets
                }}
                options={{
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const value = context.parsed.y;
                                    return metricType === 'bytes'
                                        ? MetricFormatters.formatBytes(value)
                                        : MetricFormatters.formatPercent(value);
                                }
                            }
                        }
                    }
                }}
            />
        </div>
    );
};