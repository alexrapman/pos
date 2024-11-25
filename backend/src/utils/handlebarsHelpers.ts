// backend/src/utils/handlebarsHelpers.ts
import Handlebars from 'handlebars';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function registerHelpers() {
    // Helper para multiplicar cantidades
    Handlebars.registerHelper('multiply', function (a: number, b: number) {
        return (a * b).toFixed(2);
    });

    // Helper para formato de moneda
    Handlebars.registerHelper('currency', function (amount: number) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    });

    // Helper para fechas
    Handlebars.registerHelper('formatDate', function (date: Date) {
        return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
    });

    // Helper para tiempo relativo
    Handlebars.registerHelper('timeAgo', function (date: Date) {
        return formatDistanceToNow(date, { locale: es, addSuffix: true });
    });

    // Helper para IVA
    Handlebars.registerHelper('calculateTax', function (amount: number, rate: number = 0.21) {
        return (amount * rate).toFixed(2);
    });

    // Helper para subtotal
    Handlebars.registerHelper('calculateSubtotal', function (items: any[]) {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    });

    // Helper para formatear números
    Handlebars.registerHelper('number', function (value: number, decimals: number = 2) {
        return value.toFixed(decimals);
    });
}