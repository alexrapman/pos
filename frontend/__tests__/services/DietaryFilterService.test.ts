// frontend/__tests__/services/DietaryFilterService.test.ts
import { DietaryFilterService } from '../../src/services/DietaryFilterService';

describe('DietaryFilterService', () => {
    let filterService: DietaryFilterService;

    const mockProducts = [
        {
            id: '1',
            name: 'Ensalada César',
            ingredients: ['lechuga', 'pollo', 'queso', 'pan'],
            dietaryInfo: {
                isVegan: false,
                isVegetarian: false,
                isGlutenFree: false
            }
        },
        {
            id: '2',
            name: 'Ensalada Vegana',
            ingredients: ['lechuga', 'tomate', 'aguacate'],
            dietaryInfo: {
                isVegan: true,
                isVegetarian: true,
                isGlutenFree: true
            }
        },
        {
            id: '3',
            name: 'Pizza Vegetariana',
            ingredients: ['masa', 'queso', 'verduras'],
            dietaryInfo: {
                isVegan: false,
                isVegetarian: true,
                isGlutenFree: false
            }
        }
    ];

    beforeEach(() => {
        filterService = new DietaryFilterService();
    });

    test('debe filtrar productos veganos correctamente', () => {
        const filtered = filterService.filterProducts(mockProducts, ['vegan']);
        expect(filtered).toHaveLength(1);
        expect(filtered[0].id).toBe('2');
    });

    test('debe filtrar productos vegetarianos correctamente', () => {
        const filtered = filterService.filterProducts(mockProducts, ['vegetarian']);
        expect(filtered).toHaveLength(2);
        expect(filtered.map(p => p.id)).toEqual(['2', '3']);
    });

    test('debe manejar múltiples restricciones', () => {
        const filtered = filterService.filterProducts(
            mockProducts,
            ['vegan', 'gluten-free']
        );
        expect(filtered).toHaveLength(1);
        expect(filtered[0].id).toBe('2');
    });

    test('debe utilizar el caché para consultas repetidas', () => {
        const spyOnFilter = jest.spyOn(filterService as any, 'meetsRestrictions');

        // Primera llamada
        filterService.filterProducts(mockProducts, ['vegan']);
        expect(spyOnFilter).toHaveBeenCalled();

        // Segunda llamada (debería usar caché)
        filterService.filterProducts(mockProducts, ['vegan']);
        expect(spyOnFilter).toHaveBeenCalledTimes(3); // Una vez por producto en la primera llamada
    });

    test('debe manejar restricciones vacías', () => {
        const filtered = filterService.filterProducts(mockProducts, []);
        expect(filtered).toEqual(mockProducts);
    });
});