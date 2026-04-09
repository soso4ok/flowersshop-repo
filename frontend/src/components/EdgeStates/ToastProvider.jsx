import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toast } from './Toast';
import './EdgeStates.scss';

// Create context for toast notifications
const ToastContext = createContext(null);

// Custom hook to use toast system
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

/**
 * Toast Provider - Wraps the app to provide global toast notifications
 * 
 * Usage:
 * const { addToast } = useToast();
 * addToast({ message: 'Added to Cart', variant: 'success' });
 */
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    // Remove a toast by ID
    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    // Add a new toast
    const addToast = useCallback(({
        message,
        variant = 'success',
        duration = 3000
    }) => {
        const id = Date.now() + Math.random();

        setToasts(prev => [...prev, { id, message, variant }]);

        // Auto-dismiss after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, [removeToast]);

    // Convenience methods
    const toast = {
        success: (message, duration) => addToast({ message, variant: 'success', duration }),
        error: (message, duration) => addToast({ message, variant: 'error', duration }),
        info: (message, duration) => addToast({ message, variant: 'info', duration })
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast, toast }}>
            {children}

            {/* Toast Container - Fixed position at bottom right */}
            <div className="toast-container">
                <AnimatePresence mode="popLayout">
                    {toasts.map(toast => (
                        <Toast
                            key={toast.id}
                            id={toast.id}
                            message={toast.message}
                            variant={toast.variant}
                            onClose={removeToast}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
