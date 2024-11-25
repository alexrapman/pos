// backend/src/utils/tpvHelpers.ts
import Handlebars from 'handlebars';

export function registerTPVHelpers() {
    // Helper para calcular descuentos
    Handlebars.registerHelper('applyDiscount', function (amount: number, discountPercent: number) {
        const discount = amount * (discountPercent / 100);
        return (amount - discount).toFixed(2);
    });

    // Helper para formatear mesa
    Handlebars.registerHelper('formatTable', function (tableNumber: number) {
        return `Mesa ${tableNumber.toString().padStart(2, '0')}`;
    });

    // Helper para calcular propina sugerida
    Handlebars.registerHelper('suggestedTip', function (amount: number) {
        return {
            tip5: (amount * 0.05).toFixed(2),
            tip10: (amount * 0.10).toFixed(2),
            tip15: (amount * 0.15).toFixed(2)
        };
    });

    // Helper para formatear código de pedido
    Handlebars.registerHelper('formatOrderCode', function (orderId: string) {
        return `#${orderId.slice(-6).toUpperCase()}`;
    });

    // Helper para totales acumulados
    Handlebars.registerHelper('runningTotal', function (items: any[]) {
        let total = 0;
        return items.map(item => {
            total += item.price * item.quantity;
            return {
                ...item,
                runningTotal: total.toFixed(2)
            };
        });
    });

    // Helper para estado del pedido
    Handlebars.registerHelper('orderStatus', function (status: string) {
        const statusMap = {
            'pending': 'Pendiente',
            'preparing': 'En preparación',
            'ready': 'Listo',
            'served': 'Servido',
            'paid': 'Pagado'
        };
        return statusMap[status as keyof typeof statusMap] || status;
    });
}