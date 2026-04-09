import React from 'react';
import { motion } from 'framer-motion';
import './EdgeStates.scss';

/**
 * Cart Item Skeleton - matches the cart item layout
 * Shows image, name, price, and quantity placeholders
 */
export const CartItemSkeleton = ({ index = 0 }) => {
    return (
        <motion.div
            className="cart-item-skeleton"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
        >
            <div className="skeleton cart-item-skeleton__image" />
            <div className="cart-item-skeleton__details">
                <div className="skeleton cart-item-skeleton__name" />
                <div className="skeleton cart-item-skeleton__price" />
            </div>
            <div className="skeleton cart-item-skeleton__quantity" />
        </motion.div>
    );
};
