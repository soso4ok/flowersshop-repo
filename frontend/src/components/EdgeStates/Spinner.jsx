import React from 'react';
import { motion } from 'framer-motion';
import './EdgeStates.scss';

/**
 * Elegant thin-stroke spinner component
 * Design: 2px stroke ring in Dark Moss Green that rotates smoothly
 * Sizes: sm (16px), md (24px), lg (40px)
 */
export const Spinner = ({
    size = 'md',
    variant = 'default',
    className = ''
}) => {
    const sizeClass = `spinner--${size}`;
    const variantClass = variant === 'light' ? 'spinner--light' : '';

    return (
        <motion.div
            className={`spinner ${sizeClass} ${variantClass} ${className}`}
            animate={{ rotate: 360 }}
            transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear'
            }}
        >
            <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
            </svg>
        </motion.div>
    );
};
