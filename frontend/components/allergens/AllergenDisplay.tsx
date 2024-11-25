// frontend/components/allergens/AllergenDisplay.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from '../ui/Tooltip';

interface Allergen {
    id: string;
    name: string;
    icon: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
}

interface AllergenDisplayProps {
    allergens: Allergen[];
    showDescription?: boolean;
    className?: string;
}

export const AllergenDisplay: React.FC<AllergenDisplayProps> = ({
    allergens,
    showDescription = true,
    className = ''
}) => {
    const [selectedAllergen, setSelectedAllergen] = useState<Allergen | null>(null);

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {allergens.map((allergen) => (
                <motion.div
                    key={allergen.id}
                    className={`allergen-tag ${allergen.severity}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => setSelectedAllergen(allergen)}
                    onMouseLeave={() => setSelectedAllergen(null)}
                >
                    <span className="allergen-icon">{allergen.icon}</span>
                    <span>{allergen.name}</span>

                    {showDescription && selectedAllergen?.id === allergen.id && (
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute bottom-full mb-2 p-2 bg-white rounded-lg shadow-lg"
                            >
                                <Tooltip content={allergen.description} />
                            </motion.div>
                        </AnimatePresence>
                    )}
                </motion.div>
            ))}
        </div>
    );
};