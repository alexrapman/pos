// backend/src/utils/templateHelpers.ts
import Handlebars from 'handlebars';
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';

const locales = { enUS, es };

export function registerHelpers() {
    Handlebars.registerHelper('formatDate', (date: string, locale = 'enUS') => {
        return format(new Date(date), 'PPP', {
            locale: locales[locale]
        });
    });

    Handlebars.registerHelper('formatCurrency', (amount: number, locale = 'en-US') => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    });
}