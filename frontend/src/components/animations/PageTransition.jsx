import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
                duration: 0.35,
                ease: [0.25, 0.46, 0.45, 0.94],
                // Slight delay to let React settle
                delay: 0.05
            }}
            style={{
                // GPU promotion hints
                willChange: 'transform, opacity',
                transform: 'translateZ(0)'
            }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
