import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import React from 'react';
import './Footer.scss';

// Organic Floral SVG - Growing element behind the massive brand
const FloralGrowth = () => (
    <svg
        className="footer__floral-svg"
        viewBox="0 0 400 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax slice"
    >
        {/* Main stem */}
        <path
            d="M200 600 Q200 500 180 400 Q160 300 200 200 Q220 150 200 80"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
        />
        {/* Left branch */}
        <path
            d="M180 450 Q120 420 80 380 Q60 360 40 300"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
        />
        {/* Right branch */}
        <path
            d="M190 380 Q250 350 300 320 Q340 300 360 260"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
        />
        {/* Left leaf cluster */}
        <ellipse
            cx="60"
            cy="340"
            rx="25"
            ry="40"
            transform="rotate(-30 60 340)"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
        />
        <ellipse
            cx="45"
            cy="380"
            rx="20"
            ry="35"
            transform="rotate(-45 45 380)"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
        />
        {/* Right leaf cluster */}
        <ellipse
            cx="340"
            cy="280"
            rx="25"
            ry="40"
            transform="rotate(30 340 280)"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
        />
        <ellipse
            cx="360"
            cy="240"
            rx="20"
            ry="32"
            transform="rotate(15 360 240)"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
        />
        {/* Top flower petals */}
        <ellipse
            cx="200"
            cy="100"
            rx="30"
            ry="50"
            transform="rotate(0 200 100)"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
        />
        <ellipse
            cx="170"
            cy="120"
            rx="25"
            ry="45"
            transform="rotate(-40 170 120)"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
        />
        <ellipse
            cx="230"
            cy="120"
            rx="25"
            ry="45"
            transform="rotate(40 230 120)"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
        />
        <ellipse
            cx="155"
            cy="150"
            rx="22"
            ry="38"
            transform="rotate(-60 155 150)"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
        />
        <ellipse
            cx="245"
            cy="150"
            rx="22"
            ry="38"
            transform="rotate(60 245 150)"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
        />
        {/* Flower center */}
        <circle cx="200" cy="130" r="15" stroke="currentColor" strokeWidth="0.8" fill="none" />
        {/* Small accent buds */}
        <circle cx="100" cy="320" r="8" stroke="currentColor" strokeWidth="0.6" fill="none" />
        <circle cx="320" cy="300" r="10" stroke="currentColor" strokeWidth="0.6" fill="none" />
    </svg>
);

const Footer = () => {
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    if (location.pathname.startsWith('/admin')) return null;

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail('');
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    const linkVariants = {
        initial: { x: 0 },
        hover: {
            x: 4,
            color: '#E07A5F',
            transition: { duration: 0.2 }
        }
    };

    return (
        <footer className="footer">
            {/* Part A: Newsletter & Navigation */}
            <div className="footer__top">
                {/* Newsletter Section - Left */}
                <div className="footer__newsletter">
                    <h2 className="footer__newsletter-title">Join the Garden.</h2>
                    <p className="footer__newsletter-subtitle">
                        Receive seasonal inspiration and exclusive offers.
                    </p>
                    <form className="footer__newsletter-form" onSubmit={handleSubscribe}>
                        <div className="footer__input-wrapper">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="footer__input"
                                required
                            />
                            <button type="submit" className="footer__subscribe-btn">
                                {isSubscribed ? 'Thank you!' : 'Subscribe'}
                                {!isSubscribed && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Divider Line */}
                <div className="footer__divider footer__divider--vertical" />

                {/* Links Section - Right */}
                <nav className="footer__nav">
                    {/* Shop Column */}
                    <div className="footer__nav-column">
                        <h3 className="footer__nav-title">Shop</h3>
                        <ul className="footer__nav-list">
                            <li>
                                <motion.div variants={linkVariants} initial="initial" whileHover="hover">
                                    <Link to="/">Collections</Link>
                                </motion.div>
                            </li>
                            <li>
                                <motion.div variants={linkVariants} initial="initial" whileHover="hover">
                                    <Link to="/">Seasonal</Link>
                                </motion.div>
                            </li>
                            <li>
                                <motion.div variants={linkVariants} initial="initial" whileHover="hover">
                                    <Link to="/orders">My Orders</Link>
                                </motion.div>
                            </li>
                        </ul>
                    </div>

                    {/* Journal Column */}
                    <div className="footer__nav-column">
                        <h3 className="footer__nav-title">Journal</h3>
                        <ul className="footer__nav-list">
                            <li>
                                <motion.div variants={linkVariants} initial="initial" whileHover="hover">
                                    <Link to="/blog">Stories</Link>
                                </motion.div>
                            </li>
                            <li>
                                <motion.div variants={linkVariants} initial="initial" whileHover="hover">
                                    <Link to="/about">Our Story</Link>
                                </motion.div>
                            </li>
                            <li>
                                <motion.div variants={linkVariants} initial="initial" whileHover="hover">
                                    <Link to="/about">Sustainability</Link>
                                </motion.div>
                            </li>
                        </ul>
                    </div>

                    {/* Socials Column */}
                    <div className="footer__nav-column">
                        <h3 className="footer__nav-title">Connect</h3>
                        <ul className="footer__nav-list">
                            <li>
                                <motion.div variants={linkVariants} initial="initial" whileHover="hover">
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                                </motion.div>
                            </li>
                            <li>
                                <motion.div variants={linkVariants} initial="initial" whileHover="hover">
                                    <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">Pinterest</a>
                                </motion.div>
                            </li>
                            <li>
                                <motion.div variants={linkVariants} initial="initial" whileHover="hover">
                                    <a href="mailto:hello@floralia.com">Contact</a>
                                </motion.div>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            {/* Horizontal Divider */}
            <div className="footer__divider footer__divider--horizontal" />

            {/* Part B: Massive Brand */}
            <div className="footer__brand-section">
                {/* Organic Floral Element - Behind Text */}
                <FloralGrowth />

                {/* Giant Brand Text */}
                <h2 className="footer__brand-text">FLORALIA</h2>

                {/* Meta Footer - Overlaying bottom */}
                <div className="footer__meta">
                    <span>© 2026 Floralia</span>
                    <span className="footer__meta-separator">·</span>
                    <Link to="/privacy">Privacy Policy</Link>
                    <span className="footer__meta-separator">·</span>
                    <Link to="/terms">Terms</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
