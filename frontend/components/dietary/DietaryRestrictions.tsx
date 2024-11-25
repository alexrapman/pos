// frontend/components/dietary/DietaryRestrictions.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DietaryRestriction {
    id: string;
    name: string;
    icon: string;
    description: string;
    excludedIngredients: string[];
}

interface DietaryRestrictionsProps {
    restrictions: DietaryRestriction[];
    onRestrictionChange: (selectedRestrictions: string[]) => void;
    initialSelected?: string[];
}

export const DietaryRestrictions: React.FC<DietaryRestrictionsProps> = ({
    restrictions,
    onRestrictionChange,
    initialSelected = []
}) => {
    const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(initialSelected);

    const toggleRestriction = (restrictionId: string) => {
        const newSelection = selectedRestrictions.includes(restrictionId)
            ? selectedRestrictions.filter(id => id !== restrictionId)
            : [...selectedRestrictions, restrictionId];

        setSelectedRestrictions(newSelection);
        onRestrictionChange(newSelection);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Restricciones Dietéticas</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {restrictions.map(restriction => (
                    <motion.button
                        key={restriction.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleRestriction(restriction.id)}
                        className={`
                            p-3 rounded-lg border transition-colors
                            flex items-center gap-2
                            ${selectedRestrictions.includes(restriction.id)
                                ? 'bg-green-50 border-green-500 text-green-700'
                                : 'bg-white border-gray-200 text-gray-700'}
                        `}
                    >
                        <span className="text-2xl">{restriction.icon}</span>
                        <div className="text-left">
                            <p className="font-medium">{restriction.name}</p>
                            <p className="text-sm text-gray-500">{restriction.description}</p>
                        </div>
                    </motion.button>
                ))}
            </div>

            {selectedRestrictions.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-800">
                        Ingredientes excluidos:
                    </h4>
                    <ul className="mt-2 space-y-1">
                        {restrictions
                            .filter(r => selectedRestrictions.includes(r.id))
                            .flatMap(r => r.excludedIngredients)
                            .map((ingredient, index) => (
                                <li key={index} className="text-sm text-yellow-700">
                                    • {ingredient}
                                </li>
                            ))
                        }
                    </ul>
                </div>
            )}
        </div>
    );
};