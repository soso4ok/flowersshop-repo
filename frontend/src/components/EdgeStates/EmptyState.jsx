import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './EdgeStates.scss';

/**
 * Reusable Empty State component
 * Used when there's no data to display (empty cart, no orders, no search results)
 * 
 * @param {React.Component} icon - Lucide icon component
 * @param {string} title - Main heading text
 * @param {string} message - Descriptive text
 * @param {object} actionButton - { label: string, href?: string, onClick?: function }
 */
export const EmptyState = ({
    icon: Icon,
    title,
    message,
    actionButton
}) => {
    const ActionButton = () => {
        if (!actionButton) return null;

        const buttonProps = {
            className: 'empty-state__action'
        };

        // Use Link for internal navigation, button for onClick actions
        if (actionButton.href) {
            return (
                <Link to={actionButton.href} {...buttonProps}>
                    {actionButton.label}
                </Link>
            );
        }

        return (
            <button onClick={actionButton.onClick} {...buttonProps}>
                {actionButton.label}
            </button>
        );
    };

    return (
        <motion.div
            className="empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {Icon && (
                <motion.div
                    className="empty-state__icon-wrapper"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
                >
                    <Icon />
                </motion.div>
            )}

            <motion.h2
                className="empty-state__title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
            >
                {title}
            </motion.h2>

            {message && (
                <motion.p
                    className="empty-state__message"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                >
                    {message}
                </motion.p>
            )}

            {actionButton && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                >
                    <ActionButton />
                </motion.div>
            )}
        </motion.div>
    );
};
