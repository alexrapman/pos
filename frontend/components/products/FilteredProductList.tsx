// frontend/components/products/FilteredProductList.tsx
import React, { useState, useEffect } from 'react';
import { DietaryFilterService } from '../../src/services/DietaryFilterService';

interface FilteredProductListProps {
    products: Product[];
    selectedRestrictions: string[];
}

export const FilteredProductList: React.FC<FilteredProductListProps> = ({
    products,
    selectedRestrictions
}) => {
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const filterService = new DietaryFilterService();

    useEffect(() => {
        const filtered = filterService.filterProducts(products, selectedRestrictions);
        setFilteredProducts(filtered);
    }, [products, selectedRestrictions]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
                <div
                    key={product.id}
                    className="p-4 bg-white rounded-lg shadow"
                >
                    <h3 className="font-bold">{product.name}</h3>
                    <div className="mt-2 flex flex-wrap gap-1">
                        {product.dietaryInfo.isVegan && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                Vegano
                            </span>
                        )}
                        {product.dietaryInfo.isVegetarian && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                Vegetariano
                            </span>
                        )}
                        {product.dietaryInfo.isGlutenFree && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                Sin Gluten
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};