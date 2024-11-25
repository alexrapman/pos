// src/utils/animations.ts
import { AnimationControls, animate } from 'framer-motion';

export const WINDOWS_ANIMATION_CONFIG = {
    type: "spring",
    stiffness: 200,
    damping: 20
};

export const fadeTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: WINDOWS_ANIMATION_CONFIG
};

// src/components/ui/ThemedTransition.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../providers/ThemeProvider';

export const ThemedTransition: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const { isDark, isHighContrast } = useTheme();

    return (
        <AnimatePresence mode= "wait" >
        <motion.div
                key={ `${isDark}-${isHighContrast}` }
    initial = {{ opacity: 0, scale: 0.95 }
}
animate = {{ opacity: 1, scale: 1 }}
exit = {{ opacity: 0, scale: 1.05 }}
transition = { WINDOWS_ANIMATION_CONFIG }
    >
    { children }
    </motion.div>
    </AnimatePresence>
    );
};