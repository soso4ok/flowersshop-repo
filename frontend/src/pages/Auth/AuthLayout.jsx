import React from 'react';
import { motion } from 'framer-motion';
import './AuthLayout.scss';

const Marquee = ({ text }) => {
    return (
        <div className="marquee-container">
            <motion.div
                className="marquee-text"
                initial={{ x: 0 }}
                animate={{ x: "-50%" }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                {text} {text} {text} {text}
            </motion.div>
        </div>
    );
};

const AuthLayout = ({ children, title, visualImage, isRegister = false }) => {
    return (
        <div className="auth-page">
            {/* Background Kinetic Typography */}
            <Marquee text="BLOOM • NATURE • SOUL • FLORALIA • " />

            <div className="auth-content">
                {/* 2. Overlapping Visual */}
                <motion.div
                    className="auth-visual"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                    <img src={visualImage} alt="Luxury Floral Editorial" />
                </motion.div>

                {/* 3. Glass Form Card */}
                <motion.div
                    className="auth-form-card"
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="auth-form-header">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            {title}
                        </motion.h1>
                    </div>

                    {children}
                </motion.div>
            </div>
        </div>
    );
};

export default AuthLayout;
