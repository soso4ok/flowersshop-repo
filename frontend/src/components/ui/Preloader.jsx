import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.scss';

const Preloader = ({ onComplete }) => {
    const [count, setCount] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const brandName = "Floralia";
    const characters = brandName.split('');

    // Lock scroll while loading
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    // Fast count animation - accelerating towards end
    useEffect(() => {
        const duration = 1200; // 1.2 seconds total
        let startTime = null;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            // Ease-out curve for accelerating count
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
            const newCount = Math.floor(easedProgress * 100);

            setCount(newCount);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, []);

    // Trigger exit when count reaches 100
    useEffect(() => {
        if (count >= 100) {
            const exitDelay = setTimeout(() => {
                setIsExiting(true);
            }, 200); // Quick 200ms pause

            return () => clearTimeout(exitDelay);
        }
    }, [count]);

    // Notify parent when animation completes
    useEffect(() => {
        if (isExiting) {
            const completeTimer = setTimeout(() => {
                setIsComplete(true);
                onComplete?.();
            }, 800); // Match faster exit animation

            return () => clearTimeout(completeTimer);
        }
    }, [isExiting, onComplete]);

    // Dynamic character variants with wave effect
    const charVariants = {
        hidden: (i) => ({
            y: 80,
            opacity: 0,
            rotateX: -90
        }),
        visible: (i) => ({
            y: 0,
            opacity: 1,
            rotateX: 0,
            transition: {
                duration: 0.5,
                delay: i * 0.04, // Fast stagger
                ease: [0.22, 1, 0.36, 1]
            }
        }),
        exit: (i) => ({
            y: -50,
            opacity: 0,
            transition: {
                duration: 0.3,
                delay: i * 0.02,
                ease: [0.22, 1, 0.36, 1]
            }
        })
    };

    // Container exit animation
    const containerVariants = {
        visible: { y: 0 },
        exit: {
            y: '-100%',
            transition: {
                duration: 0.8,
                ease: [0.76, 0, 0.24, 1]
            }
        }
    };

    // Progress line with elastic animation
    const lineVariants = {
        initial: { scaleX: 0, originX: 0 },
        animate: {
            scaleX: count / 100,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }
    };

    // Decorative dots animation
    const dotVariants = {
        animate: (i) => ({
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3],
            transition: {
                duration: 0.8,
                delay: i * 0.15,
                repeat: Infinity,
                repeatDelay: 0.4
            }
        })
    };

    if (isComplete) return null;

    return (
        <AnimatePresence>
            {!isComplete && (
                <motion.div
                    className="preloader"
                    variants={containerVariants}
                    initial="visible"
                    animate={isExiting ? "exit" : "visible"}
                    exit="exit"
                >
                    {/* Animated Background Gradient */}
                    <motion.div
                        className="preloader__bg-gradient"
                        animate={{
                            background: [
                                'radial-gradient(circle at 30% 50%, rgba(224, 122, 95, 0.08) 0%, transparent 50%)',
                                'radial-gradient(circle at 70% 50%, rgba(224, 122, 95, 0.08) 0%, transparent 50%)',
                                'radial-gradient(circle at 30% 50%, rgba(224, 122, 95, 0.08) 0%, transparent 50%)'
                            ]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* Brand Name - Staggered Characters with 3D flip */}
                    <motion.h1
                        className="preloader__brand"
                        initial="hidden"
                        animate={isExiting ? "exit" : "visible"}
                    >
                        {characters.map((char, index) => (
                            <motion.span
                                key={index}
                                className="preloader__char"
                                custom={index}
                                variants={charVariants}
                                style={{ perspective: '500px' }}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </motion.h1>

                    {/* Animated Dots */}
                    <div className="preloader__dots">
                        {[0, 1, 2].map((i) => (
                            <motion.span
                                key={i}
                                className="preloader__dot"
                                custom={i}
                                animate="animate"
                                variants={dotVariants}
                            />
                        ))}
                    </div>

                    {/* Percentage Counter with spring animation */}
                    <motion.div
                        className="preloader__counter"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                    >
                        <motion.span
                            className="preloader__count"
                            key={count}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            {count}
                        </motion.span>
                        <span className="preloader__percent">%</span>
                    </motion.div>

                    {/* Dynamic Progress Line */}
                    <motion.div
                        className="preloader__line"
                        variants={lineVariants}
                        initial="initial"
                        animate="animate"
                    />

                    {/* Second decorative line */}
                    <motion.div
                        className="preloader__line preloader__line--secondary"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: count / 100 }}
                        transition={{
                            type: "spring",
                            stiffness: 80,
                            damping: 25,
                            delay: 0.1
                        }}
                        style={{ originX: 1 }}
                    />

                    {/* Bottom Curved SVG */}
                    <motion.svg
                        className="preloader__curve"
                        viewBox="0 0 1440 100"
                        preserveAspectRatio="none"
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <path
                            d="M0,100 C480,0 960,0 1440,100 L1440,100 L0,100 Z"
                            fill="#F9F8F4"
                        />
                    </motion.svg>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
