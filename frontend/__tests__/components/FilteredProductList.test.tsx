// frontend/__tests__/components/FilteredProductList.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FilteredProductList } from '../../components/products/FilteredProductList';
import { DietaryRestrictions } from '../../components/dietary/DietaryRestrictions';

describe('Integración de Filtrado de Productos', () => {
    const mockProducts = [
        {
            id: '1',
            name: 'Hamburguesa Clásica',
            ingredients: ['carne', 'pan', 'lechuga'],
            dietaryInfo: {
                isVegan: false,
                isVegetarian: false,
                isGlutenFree: false
            }
        },
        {
            id: '2',
            name: 'Ensalada Verde',
            ingredients: ['lechuga', 'tomate', 'aguacate'],
            dietaryInfo: {
                isVegan: true,
                isVegetarian: true,
                isGlutenFree: true
            }
        }
    ];

    const mockRestrictions = [
        {
            id: 'vegan',
            name: 'Vegano',
            icon: '🌱',
            description: 'Sin productos animales',
            excludedIngredients: ['carne', 'pescado', 'huevo', 'lácteos']
        },
        {
            id: 'gluten-free',
            name: 'Sin Gluten',
            icon: '🌾',
            description: 'Sin gluten',
            excludedIngredients: ['trigo', 'cebada', 'centeno']
        }
    ];

    test('debe mostrar todos los productos inicialmente', () => {
        render(
            <FilteredProductList
                products={mockProducts}
                selectedRestrictions={[]}
            />
        );

        expect(screen.getByText('Hamburguesa Clásica')).toBeInTheDocument();
        expect(screen.getByText('Ensalada Verde')).toBeInTheDocument();
    });

    test('debe filtrar productos al seleccionar restricciones', async () => {
        const { rerender } = render(
            <FilteredProductList
                products={mockProducts}
                selectedRestrictions={[]}
            />
        );

        // Simular selección de filtro vegano
        rerender(
            <FilteredProductList
                products={mockProducts}
                selectedRestrictions={['vegan']}
            />
        );

        await waitFor(() => {
            expect(screen.queryByText('Hamburguesa Clásica')).not.toBeInTheDocument();
            expect(screen.getByText('Ensalada Verde')).toBeInTheDocument();
        });
    });

    test('debe actualizar etiquetas dietéticas correctamente', async () => {
        render(
            <FilteredProductList
                products={mockProducts}
                selectedRestrictions={['vegan', 'gluten-free']}
            />
        );

        const veganProduct = screen.getByText('Ensalada Verde');
        const veganBadge = screen.getByText('Vegano');
        const glutenFreeBadge = screen.getByText('Sin Gluten');

        expect(veganProduct).toBeInTheDocument();
        expect(veganBadge).toBeInTheDocument();
        expect(glutenFreeBadge).toBeInTheDocument();
    });

    test('debe manejar cambios dinámicos en las restricciones', async () => {
        const onRestrictionChange = jest.fn();

        render(
            <>
                <DietaryRestrictions
                    restrictions={mockRestrictions}
                    onRestrictionChange={onRestrictionChange}
                />
                <FilteredProductList
                    products={mockProducts}
                    selectedRestrictions={[]}
                />
            </>
        );

        fireEvent.click(screen.getByText('Vegano'));

        await waitFor(() => {
            expect(onRestrictionChange).toHaveBeenCalledWith(['vegan']);
        });
    });
});