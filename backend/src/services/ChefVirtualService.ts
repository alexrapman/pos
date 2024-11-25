// backend/src/services/ChefVirtualService.ts
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { Recommendation } from '../models/Recommendation';

export class ChefVirtualService {
    async generateRecommendations(userId: string): Promise<Recommendation[]> {
        // Obtener pedidos anteriores del usuario
        const orders = await Order.findAll({ where: { userId }, include: [Product] });

        // Analizar los productos más pedidos
        const productCounts: Record<string, number> = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                if (!productCounts[item.productId]) {
                    productCounts[item.productId] = 0;
                }
                productCounts[item.productId]++;
            });
        });

        // Obtener los productos más populares
        const popularProducts = Object.entries(productCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([productId]) => productId);

        // Generar recomendaciones basadas en los productos populares
        const recommendations = await Recommendation.findAll({
            where: { productId: popularProducts }
        });

        return recommendations;
    }
}