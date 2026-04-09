import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import './EdgeStates.scss';

/**
 * Inline Error component for form field validation
 * Shows a subtle slide-down animation when error appears
 * 
 * @param {string} message - Error message to display
 * @param {boolean} show - Whether to show the error
 */
export const InlineError = ({ message, show = true }) => {
    return (
        <AnimatePresence mode="wait">
            {show && message && (
                <motion.div
                    className="inline-error"
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                    <AlertCircle />
                    <span>{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
