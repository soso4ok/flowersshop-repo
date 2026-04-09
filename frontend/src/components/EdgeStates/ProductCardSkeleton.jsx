import React from 'react';
import { motion } from 'framer-motion';
import './EdgeStates.scss';

/**
 * Product Card Skeleton - matches the BouquetsCard layout exactly
 * Shows the shape of content while loading
 */
export const ProductCardSkeleton = ({ index = 0 }) => {
    return (
        <motion.div
            className="product-card-skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
        >
            <div className="skeleton product-card-skeleton__image" />
            <div className="skeleton product-card-skeleton__title" />
            <div className="skeleton product-card-skeleton__price" />
        </motion.div>
    );
};
