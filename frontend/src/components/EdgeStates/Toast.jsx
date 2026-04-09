import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import './EdgeStates.scss';

/**
 * Individual Toast notification component
 * Part of the Toast notification system
 */
export const Toast = ({
    id,
    message,
    variant = 'success',
    onClose
}) => {
    const icons = {
        success: CheckCircle2,
        error: AlertCircle,
        info: Info
    };

    const Icon = icons[variant] || CheckCircle2;

    return (
        <motion.div
            className={`toast toast--${variant}`}
            layout
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30
            }}
        >
            <div className="toast__icon">
                <Icon />
            </div>
            <div className="toast__content">
                {message}
            </div>
            <button
                className="toast__close"
                onClick={() => onClose(id)}
                aria-label="Dismiss notification"
            >
                <X />
            </button>
        </motion.div>
    );
};
