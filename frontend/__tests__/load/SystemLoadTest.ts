// frontend/__tests__/load/SystemLoadTest.ts
import { DietaryFilterService } from '../../src/services/DietaryFilterService';
import { performance } from 'perf_hooks';
import * as os from 'os';

describe('Pruebas de Carga del Sistema', () => {
    let filterService: DietaryFilterService;

    // Simular carga concurrente
    const simulateLoad = async (
        numUsers: number,
        requestsPerUser: number
    ) => {
        const startTime = performance.now();
        const results: number[] = [];
        const products = generateLargeProductSet(1000);

        const userSimulation = async () => {
            for (let i = 0; i < requestsPerUser; i++) {
                const start = performance.now();
                await filterService.filterProducts(products, ['vegan', 'gluten-free']);
                results.push(performance.now() - start);
                // Simular tiempo entre peticiones
                await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
            }
        };

        // Ejecutar simulaciones de usuarios concurrentes
        const users = Array(numUsers).fill(0).map(() => userSimulation());
        await Promise.all(users);

        const totalTime = performance.now() - startTime;
        return {
            totalTime,
            averageResponseTime: results.reduce((a, b) => a + b) / results.length,
            maxResponseTime: Math.max(...results),
            minResponseTime: Math.min(...results),
            successfulRequests: results.length,
            cpuUsage: process.cpuUsage(),
            memoryUsage: process.memoryUsage()
        };
    };

    test('debe mantener rendimiento bajo carga media', async () => {
        const results = await simulateLoad(50, 10);

        expect(results.averageResponseTime).toBeLessThan(100);
        expect(results.maxResponseTime).toBeLessThan(200);
        expect(results.memoryUsage.heapUsed).toBeLessThan(100 * 1024 * 1024); // 100MB
    });

    test('debe manejar picos de carga', async () => {
        const results = await simulateLoad(100, 5);

        expect(results.successfulRequests).toBe(500);
        expect(results.averageResponseTime).toBeLessThan(150);
    });

    test('debe mantener estabilidad en ejecución prolongada', async () => {
        const initialMemory = process.memoryUsage().heapUsed;
        await simulateLoad(20, 50);
        const finalMemory = process.memoryUsage().heapUsed;

        // Verificar que no haya fugas de memoria significativas
        expect(finalMemory - initialMemory).toBeLessThan(50 * 1024 * 1024); // 50MB
    });
});