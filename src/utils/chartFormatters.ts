// src/utils/chartFormatters.ts
import { ChartData } from 'chart.js';
import { Order, OrderStatus } from '../models/Order';

export interface ChartDataPoint {
    x: string | number;
    y: number;
}

export const formatCompletionTimeData = (orders: Order[]): ChartData<'line'> => {
    const completionTimes = orders
        .filter(order => order.status === OrderStatus.DELIVERED)
        .map(order => ({
            x: new Date(order.createdAt).toLocaleTimeString(),
            y: (new Date(order.completedAt!).getTime() - new Date(order.createdAt).getTime()) / 1000 / 60
        }));

    return {
        labels: completionTimes.map(point => point.x),
        datasets: [{
            label: 'Completion Time (minutes)',
            data: completionTimes.map(point => point.y),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };
};

export const formatHourlyOrdersData = (orders: Order[]): ChartData<'bar'> => {
    const hourCounts = new Array(24).fill(0);

    orders.forEach(order => {
        const hour = new Date(order.createdAt).getHours();
        hourCounts[hour]++;
    });

    return {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [{
            label: 'Orders per Hour',
            data: hourCounts,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1
        }]
    };
};