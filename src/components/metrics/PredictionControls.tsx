// src/components/metrics/PredictionControls.tsx
import React, { useState } from 'react';
import { Slider } from '../ui/Slider';

interface PredictionControlsProps {
    onPeriodsChange: (periods: number) => void;
    onConfidenceChange: (level: number) => void;
    defaultPeriods?: number;
    defaultConfidence?: number;
}

export const PredictionControls: React.FC<PredictionControlsProps> = ({
    onPeriodsChange,
    onConfidenceChange,
    defaultPeriods = 5,
    defaultConfidence = 0.95
}) => {
    const [periods, setPeriods] = useState(defaultPeriods);
    const [confidence, setConfidence] = useState(defaultConfidence);

    const handlePeriodsChange = (value: number) => {
        setPeriods(value);
        onPeriodsChange(value);
    };

    const handleConfidenceChange = (value: number) => {
        setConfidence(value);
        onConfidenceChange(value);
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Períodos de Predicción
                </label>
                <Slider
                    value={periods}
                    onChange={handlePeriodsChange}
                    min={1}
                    max={20}
                    step={1}
                />
                <span className="text-sm text-gray-500">
                    Prediciendo {periods} períodos adelante
                </span>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nivel de Confianza
                </label>
                <Slider
                    value={confidence * 100}
                    onChange={(value) => handleConfidenceChange(value / 100)}
                    min={80}
                    max={99}
                    step={1}
                />
                <span className="text-sm text-gray-500">
                    {(confidence * 100).toFixed(0)}% de confianza
                </span>
            </div>
        </div>
    );
};