import React from 'react';
import { motion } from 'framer-motion';

const FadeInUp = ({ children, delay = 0, duration = 0.5 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            style={{
                // GPU promotion hints for smooth scroll-triggered animations
                willChange: 'transform, opacity',
                transform: 'translateZ(0)'
            }}
        >
            {children}
        </motion.div>
    );
};

export default FadeInUp;
