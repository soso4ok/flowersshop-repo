import React from 'react';
import { motion } from 'framer-motion';
import { Flower2 } from 'lucide-react';
import './EdgeStates.scss';

/**
 * Error Boundary component for catching React errors
 * Displays a friendly "We couldn't bloom this page" message
 */
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        console.error('Error Boundary caught an error:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <motion.div
                        className="error-boundary__icon-wrapper"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        <Flower2 />
                    </motion.div>

                    <motion.h1
                        className="error-boundary__title"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        We couldn't bloom this page
                    </motion.h1>

                    <motion.p
                        className="error-boundary__message"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                    >
                        Something went wrong while loading this page.
                        Please try refreshing to see if that helps.
                    </motion.p>

                    <motion.button
                        className="error-boundary__action"
                        onClick={this.handleReload}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Reload Page
                    </motion.button>
                </div>
            );
        }

        return this.props.children;
    }
}
