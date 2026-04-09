import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import React from "react";
import './hero.scss';

// Import the new botanical line art images
import peoniesImg from '../../../assets/hero/peonies.png';
import poppyImg from '../../../assets/hero/poppy.png';
import eucalyptusImg from '../../../assets/hero/eucalyptus.png';

// Session storage key for tracking intro state
const INTRO_SEEN_KEY = 'hasSeenIntro';

const WatercolorSplash = ({ className, color, delay = 0, isInView, isInstant }) => {
    const splashVariants = {
        hidden: {
            scale: 0.8,
            opacity: 0,
            rotate: -5
        },
        visible: {
            scale: 1,
            opacity: 0.1,
            rotate: 0,
            transition: {
                duration: isInstant ? 0.5 : 3,
                ease: "easeOut",
                delay: isInstant ? 0 : delay
            }
        }
    };

    return (
        <motion.div
            className={`hero-artistic__splash ${className}`}
            variants={splashVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M50 300C50 150 150 50 300 30C450 10 550 100 580 250C610 400 500 550 350 570C200 590 80 500 50 350Z"
                    fill={color}
                />
            </svg>
        </motion.div>
    );
};

const HeroArtistic = () => {
    // Check if user has seen intro before (persists for session)
    const [hasSeenIntro, setHasSeenIntro] = useState(() => {
        return sessionStorage.getItem(INTRO_SEEN_KEY) === 'true';
    });

    // Ref for viewport detection
    const heroRef = useRef(null);
    const isInView = useInView(heroRef, { once: true, amount: 0.3 });

    // Mark intro as seen once hero is in view
    useEffect(() => {
        if (isInView && !hasSeenIntro) {
            // Set a small delay to ensure the full animation plays first time
            const timer = setTimeout(() => {
                sessionStorage.setItem(INTRO_SEEN_KEY, 'true');
                setHasSeenIntro(true);
            }, 3000); // Mark as seen after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [isInView, hasSeenIntro]);

    // Dynamic timing based on whether intro has been seen
    const isInstant = hasSeenIntro;
    const textDelay = isInstant ? 0.2 : 1.5;
    const textStagger = isInstant ? 0.08 : 0.2;
    const textDuration = isInstant ? 0.4 : 0.8;

    // Reveal animation for botanical images (not used anymore but keeping for reference)
    const revealVariants = {
        hidden: {
            clipPath: 'inset(100% 0% 0% 0%)',
            opacity: 0,
            scale: 0.95
        },
        visible: {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            scale: 1,
            transition: {
                duration: isInstant ? 0.5 : 2.5,
                ease: "easeInOut",
                opacity: { duration: isInstant ? 0.3 : 0.8 }
            }
        }
    };

    // Text stagger animation with dynamic timing
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: textDelay,
                staggerChildren: textStagger
            }
        }
    };

    const textVariants = {
        hidden: { opacity: 0, y: isInstant ? 15 : 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: textDuration, ease: [0.25, 0.46, 0.45, 0.94] }
        }
    };

    return (
        <section className="hero-artistic" ref={heroRef}>
            {/* ============================================= */}
            {/* LAYER 1: Background Watercolor Splashes (z-0) */}
            {/* ============================================= */}

            {/* 1. Top Left (Large): Pale Sage Green */}
            <WatercolorSplash
                className="hero-artistic__splash--top-left"
                color="#2C3E2E"
                delay={0}
                isInView={isInView}
                isInstant={isInstant}
            />

            {/* 2. Bottom Right (Medium): Faint Terracotta/Pink */}
            <WatercolorSplash
                className="hero-artistic__splash--bottom-right"
                color="#E07A5F"
                delay={0.3}
                isInView={isInView}
                isInstant={isInstant}
            />

            {/* 3. Center-Right (Small): Subtle spot near text */}
            <WatercolorSplash
                className="hero-artistic__splash--center-right"
                color="#2C3E2E"
                delay={0.6}
                isInView={isInView}
                isInstant={isInstant}
            />

            {/* 4. Bottom Center (Wide): Ground-level wash */}
            <WatercolorSplash
                className="hero-artistic__splash--bottom-center"
                color="#E07A5F"
                delay={0.9}
                isInView={isInView}
                isInstant={isInstant}
            />

            {/* ============================================= */}
            {/* LAYER 2: Botanical Line Art (z-10) */}
            {/* ============================================= */}

            {/* Eucalyptus Branch - Left */}
            <div className="hero-artistic__image-wrapper hero-artistic__image-wrapper--left">
                <img src={eucalyptusImg} alt="Eucalyptus" className="hero-artistic__image" />
            </div>

            {/* Peonies - Bottom Right */}
            <div className="hero-artistic__image-wrapper hero-artistic__image-wrapper--right">
                <img src={peoniesImg} alt="Peonies" className="hero-artistic__image" />
            </div>

            {/* Poppy - Top Right Accent */}
            <div className="hero-artistic__image-wrapper hero-artistic__image-wrapper--top-accent">
                <img src={poppyImg} alt="Poppy" className="hero-artistic__image" />
            </div>

            {/* ============================================= */}
            {/* LAYER 3: Typography & Content (z-20) */}
            {/* ============================================= */}

            <motion.div
                className="hero-artistic__content"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                <div className="hero-artistic__content-inner">
                    <motion.span
                        className="hero-artistic__label"
                        variants={textVariants}
                    >
                        Artisanal Floristry
                    </motion.span>

                    <motion.h1
                        className="hero-artistic__title"
                        variants={textVariants}
                    >
                        Where Nature<br />
                        Becomes Art
                    </motion.h1>

                    <motion.p
                        className="hero-artistic__subtitle"
                        variants={textVariants}
                    >
                        Hand-crafted botanical arrangements that capture
                        the fleeting beauty of each season.
                    </motion.p>

                    <motion.div
                        className="hero-artistic__actions"
                        variants={textVariants}
                    >
                        <Link to="/#collections" className="hero-artistic__cta">
                            Discover Our Collection
                        </Link>
                        <Link to="/about" className="hero-artistic__cta-secondary">
                            Our Story
                        </Link>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
                className="hero-artistic__scroll"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: isInstant ? 0.5 : 3, duration: isInstant ? 0.3 : 1 }}
            >
                <motion.div
                    className="hero-artistic__scroll-dot"
                    animate={isInView ? { y: [0, 8, 0] } : { y: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>
        </section>
    );
};

export default HeroArtistic;
