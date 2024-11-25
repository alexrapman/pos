// src/services/PredictionAccuracyService.ts
export class PredictionAccuracyService {
    calculateAccuracyMetrics(actual: number[], predicted: number[]) {
        const mse = this.calculateMSE(actual, predicted);
        const mae = this.calculateMAE(actual, predicted);
        const mape = this.calculateMAPE(actual, predicted);
        const r2 = this.calculateR2(actual, predicted);

        return { mse, mae, mape, r2 };
    }

    private calculateMSE(actual: number[], predicted: number[]): number {
        const sum = actual.reduce((acc, val, i) =>
            acc + Math.pow(val - predicted[i], 2), 0);
        return sum / actual.length;
    }

    private calculateMAE(actual: number[], predicted: number[]): number {
        const sum = actual.reduce((acc, val, i) =>
            acc + Math.abs(val - predicted[i]), 0);
        return sum / actual.length;
    }

    private calculateMAPE(actual: number[], predicted: number[]): number {
        const sum = actual.reduce((acc, val, i) =>
            acc + Math.abs((val - predicted[i]) / val), 0);
        return (sum / actual.length) * 100;
    }

    private calculateR2(actual: number[], predicted: number[]): number {
        const mean = actual.reduce((a, b) => a + b) / actual.length;
        const ssTotal = actual.reduce((acc, val) =>
            acc + Math.pow(val - mean, 2), 0);
        const ssResidual = actual.reduce((acc, val, i) =>
            acc + Math.pow(val - predicted[i], 2), 0);
        return 1 - (ssResidual / ssTotal);
    }
}