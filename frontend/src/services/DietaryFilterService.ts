// frontend/services/DietaryFilterService.ts
interface Product {
    id: string;
    name: string;
    ingredients: string[];
    dietaryInfo: {
        isVegan: boolean;
        isVegetarian: boolean;
        isGlutenFree: boolean;
    };
}

export class DietaryFilterService {
    private cache: Map<string, Product[]> = new Map();

    filterProducts(
        products: Product[],
        restrictions: string[]
    ): Product[] {
        const cacheKey = restrictions.sort().join(',');

        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }

        const filteredProducts = products.filter(product =>
            this.meetsRestrictions(product, restrictions)
        );

        this.cache.set(cacheKey, filteredProducts);
        return filteredProducts;
    }

    private meetsRestrictions(product: Product, restrictions: string[]): boolean {
        return restrictions.every(restriction => {
            switch (restriction) {
                case 'vegan':
                    return product.dietaryInfo.isVegan;
                case 'vegetarian':
                    return product.dietaryInfo.isVegetarian;
                case 'gluten-free':
                    return product.dietaryInfo.isGlutenFree;
                default:
                    return true;
            }
        });
    }
}

