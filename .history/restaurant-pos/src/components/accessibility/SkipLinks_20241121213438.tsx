// src/components/accessibility/SkipLinks.tsx
export const SkipLinks: React.FC = () => {
    return (
        <nav aria-label="Enlaces de acceso rápido">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 
                           focus:z-50 focus:p-4 focus:bg-white focus:border"
            >
                Saltar al contenido principal
            </a>
            <a
                href="#nav-menu"
                className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 
                           focus:z-50 focus:p-4 focus:bg-white focus:border"
            >
                Saltar al menú de navegación
            </a>
        </nav>
    );
};