import React from 'react';
import './atelierCTACard.scss';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AtelierCTACard = () => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="atelier-cta"
        >
            <Link to="/builder" className="atelier-cta__link">
                {/* Floral background pattern — revealed on hover */}
                <div className="atelier-cta__pattern" aria-hidden="true" />

                <div className="atelier-cta__content">
                    {/* Hand-holding-flower SVG icon */}
                    <svg
                        className="atelier-cta__icon"
                        width="56"
                        height="56"
                        viewBox="0 0 56 56"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        {/* Flower petals */}
                        <ellipse cx="28" cy="12" rx="5" ry="8" stroke="currentColor" strokeWidth="1.2" opacity="0.9" />
                        <ellipse cx="28" cy="12" rx="5" ry="8" stroke="currentColor" strokeWidth="1.2" opacity="0.9" transform="rotate(60 28 12)" />
                        <ellipse cx="28" cy="12" rx="5" ry="8" stroke="currentColor" strokeWidth="1.2" opacity="0.9" transform="rotate(120 28 12)" />
                        {/* Flower center */}
                        <circle cx="28" cy="12" r="2.5" fill="currentColor" opacity="0.4" />
                        {/* Stem */}
                        <path d="M28 20 L28 34" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        {/* Small leaf on stem */}
                        <path d="M28 26 Q32 23 34 26 Q32 28 28 26" stroke="currentColor" strokeWidth="1" fill="none" />
                        {/* Hand (simplified, elegant) */}
                        <path
                            d="M20 42 Q20 36 24 34 L28 34 L32 34 Q36 36 36 42 Q36 46 32 48 L24 48 Q20 46 20 42Z"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            fill="none"
                            strokeLinejoin="round"
                        />
                        {/* Fingers holding stem */}
                        <path d="M25 34 Q25 31 26 30" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
                        <path d="M31 34 Q31 31 30 30" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
                    </svg>

                    <h3 className="atelier-cta__title">The Atelier</h3>
                    <p className="atelier-cta__subtitle">
                        Be the florist. Hand-pick your stems.
                    </p>

                    <span className="atelier-cta__btn">
                        Start Creating
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </div>
            </Link>
        </motion.div>
    );
};

export default AtelierCTACard;
