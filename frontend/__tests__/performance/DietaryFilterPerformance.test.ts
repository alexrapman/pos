// frontend/__tests__/performance/DietaryFilterPerformance.test.ts
import { DietaryFilterService } from '../../src/services/DietaryFilterService';
import { performance } from 'perf_hooks';

describe('Pruebas de Rendimiento - Filtrado Dietético', () => {
    let filterService: DietaryFilterService;

    // Generar conjunto grande de productos de prueba
    const generateLargeProductSet = (size: number) => {
        return Array.from({ length: size }, (_, index) => ({
            id: index.toString(),
            name: `Producto ${index}`,
            ingredients: ['ingrediente1', 'ingrediente2'],
            dietaryInfo: {
                isVegan: index % 2 === 0,
                isVegetarian: index % 3 === 0,
                isGlutenFree: index % 4 === 0
            }
        }));
    };

    beforeEach(() => {
        filterService = new DietaryFilterService();
        // Limpiar caché entre pruebas
        jest.clearAllMocks();
    });

    test('debe mantener tiempos de respuesta aceptables con conjuntos grandes', () => {
        const largeProductSet = generateLargeProductSet(10000);
        const start = performance.now();

        filterService.filterProducts(largeProductSet, ['vegan']);

        const end = performance.now();
        const timeElapsed = end - start;

        expect(timeElapsed).toBeLessThan(100); // Menos de 100ms
    });

    test('debe mejorar rendimiento con caché', () => {
        const products = generateLargeProductSet(5000);
        const restrictions = ['vegan', 'gluten-free'];

        // Primera ejecución (sin caché)
        const startWithoutCache = performance.now();
        filterService.filterProducts(products, restrictions);
        const timeWithoutCache = performance.now() - startWithoutCache;

        // Segunda ejecución (con caché)
        const startWithCache = performance.now();
        filterService.filterProducts(products, restrictions);
        const timeWithCache = performance.now() - startWithCache;

        expect(timeWithCache).toBeLessThan(timeWithoutCache * 0.1); // 90% más rápido con caché
    });

    test('debe manejar eficientemente múltiples restricciones', () => {
        const products = generateLargeProductSet(1000);
        const allResults: number[] = [];

        // Probar diferentes combinaciones de restricciones
        const restrictions = [
            ['vegan'],
            ['vegetarian'],
            ['gluten-free'],
            ['vegan', 'gluten-free'],
            ['vegan', 'vegetarian', 'gluten-free']
        ];

        restrictions.forEach(restrictionSet => {
            const start = performance.now();
            filterService.filterProducts(products, restrictionSet);
            const time = performance.now() - start;
            allResults.push(time);
        });

        // Verificar que todos los tiempos sean aceptables
        allResults.forEach(time => {
            expect(time).toBeLessThan(50); // Menos de 50ms por operación
        });
    });
});