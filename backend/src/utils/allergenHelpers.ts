// backend/src/utils/allergenHelpers.ts
import Handlebars from 'handlebars';

interface Allergen {
    id: string;
    name: string;
    icon: string;
    severity: 'high' | 'medium' | 'low';
}

interface DietaryRestriction {
    id: string;
    name: string;
    icon: string;
}

export function registerAllergenHelpers() {
    // Helper para mostrar alérgenos
    Handlebars.registerHelper('formatAllergens', function (allergens: string[]) {
        const allergenMap: Record<string, Allergen> = {
            'gluten': {
                id: 'gluten',
                name: 'Gluten',
                icon: '🌾',
                severity: 'high'
            },
            'lactose': {
                id: 'lactose',
                name: 'Lácteos',
                icon: '🥛',
                severity: 'high'
            },
            'nuts': {
                id: 'nuts',
                name: 'Frutos Secos',
                icon: '🥜',
                severity: 'high'
            },
            // ... más alérgenos
        };

        return allergens.map(a => allergenMap[a]).map(allergen => `
            <span class="allergen-tag ${allergen.severity}">
                ${allergen.icon} ${allergen.name}
            </span>
        `).join('');
    });

    // Helper para dietas especiales
    Handlebars.registerHelper('formatDiet', function (dietType: string) {
        const dietMap: Record<string, DietaryRestriction> = {
            'vegan': {
                id: 'vegan',
                name: 'Vegano',
                icon: '🌱'
            },
            'vegetarian': {
                id: 'vegetarian',
                name: 'Vegetariano',
                icon: '🥗'
            },
            'gluten-free': {
                id: 'gluten-free',
                name: 'Sin Gluten',
                icon: '🌾'
            }
        };

        return dietMap[dietType] ? `
            <span class="diet-tag">
                ${dietMap[dietType].icon} ${dietMap[dietType].name}
            </span>
        ` : '';
    });

    // Helper para advertencias de contaminación cruzada
    Handlebars.registerHelper('crossContamination', function (allergens: string[]) {
        if (allergens.length > 0) {
            return `
                <div class="warning-box">
                    ⚠️ Este plato puede contener trazas de: 
                    ${allergens.join(', ')}
                </div>
            `;
        }
        return '';
    });

    // Helper para nivel de picante
    Handlebars.registerHelper('spicyLevel', function (level: number) {
        const pepper = '🌶️';
        return level > 0 ? pepper.repeat(level) : 'No picante';
    });
}