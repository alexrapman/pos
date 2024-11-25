// src/services/TrendPredictionService.ts
export class TrendPredictionService {
    private calculateLinearRegression(values: number[]): {
        slope: number;
        intercept: number;
        rSquared: number;
    } {
        const n = values.length;
        const x = Array.from({ length: n }, (_, i) => i);

        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = values.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        const yMean = sumY / n;
        const totalSS = values.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
        const resSS = values.reduce((sum, yi, i) => {
            const prediction = slope * x[i] + intercept;
            return sum + Math.pow(yi - prediction, 2);
        }, 0);

        const rSquared = 1 - (resSS / totalSS);

        return { slope, intercept, rSquared };
    }

    predictNextValues(historicalData: number[], periodsAhead: number = 5): {
        predictions: number[];
        confidenceInterval: number[];
    } {
        const { slope, intercept, rSquared } = this.calculateLinearRegression(historicalData);

        const lastX = historicalData.length - 1;
        const predictions = Array.from({ length: periodsAhead }, (_, i) => {
            const x = lastX + i + 1;
            return slope * x + intercept;
        });

        const confidenceLevel = 0.95;
        const tValue = 1.96; // Valor t para 95% de confianza
        const standardError = Math.sqrt(1 - rSquared) * Math.sqrt(1 / historicalData.length);

        const confidenceInterval = predictions.map(prediction =>
            prediction * standardError * tValue
        );

        return { predictions, confidenceInterval };
    }
}