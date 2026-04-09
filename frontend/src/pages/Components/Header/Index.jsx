import './header.scss'
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles } from "lucide-react";
import { logout } from "../../../redux/slices/userSlice.js";
import UserMenu from "./UserMenu";

export const Header = () => {
    const { items, totalPrice } = useSelector((state) => state.cart);
    const user = useSelector((state) => state.user);
    const { isAuthenticated, firstName } = user;
    const [scrolled, setScrolled] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const scrollTicking = useRef(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const itemsAmount = items.reduce((acc, current) => acc + current.count, 0);

    // Optimized scroll handler with requestAnimationFrame throttling
    const handleScroll = useCallback(() => {
        if (!scrollTicking.current) {
            window.requestAnimationFrame(() => {
                setScrolled(window.scrollY > 50);
                scrollTicking.current = false;
            });
            scrollTicking.current = true;
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        setShowDropdown(false);
        navigate('/');
    };

    if (location.pathname.startsWith('/admin')) return null;

    return (
        <>
            <header className={`header ${scrolled ? 'scrolled' : ''}`}>
                <div className="content">
                    <nav className="content__nav">
                        <ul className="content__list">
                            <Link className="content__list-elem" to='/'>Collections</Link>
                            <Link className="content__list-elem" to='/blog'>Occasions</Link>
                            <Link className="content__list-elem" to='/'>Collections</Link>
                            <Link className="content__list-elem" to='/blog'>Occasions</Link>
                            <Link className="content__list-elem" to='/about'>About</Link>
                            {user.role === 'ADMIN' && (
                                <Link className="content__list-elem admin-link" to='/admin' style={{ color: '#E07A5F' }}>Admin Panel</Link>
                            )}
                        </ul>
                    </nav>

                    <Link to='/' className="content__logo">
                        <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <text x="0" y="28" fontFamily="Playfair Display" fontSize="24" fontWeight="600" fill="#2C3E2E">Floralia</text>
                        </svg>
                    </Link>

                    <div className="content__actions">
                        {isAuthenticated ? (
                            <div className="content__auth" ref={dropdownRef}>
                                <button
                                    className="content__auth-button"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    {firstName && <span className="content__auth-name">{firstName}</span>}
                                </button>

                                <UserMenu
                                    isOpen={showDropdown}
                                    onClose={() => setShowDropdown(false)}
                                    user={user}
                                    onLogout={handleLogout}
                                />
                            </div>
                        ) : (
                            <div className="content__auth-links">
                                <Link to='/login' className="content__auth">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    <span>Sign in</span>
                                </Link>
                                <Link to='/registration' className="content__signup-btn">
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        <div className="content__divider" />

                        <Link to='/builder' className="content__bespoke-btn">
                            <Sparkles size={14} strokeWidth={2.5} />
                            <span>Bespoke</span>
                        </Link>

                        <Link to='/cart' className="content-cart">
                            <div className="content-cart__price">${totalPrice.toFixed(2)}</div>
                            <div className="content-cart__bucket">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                {itemsAmount > 0 && (
                                    <div className="content-cart__orders">
                                        {itemsAmount}
                                    </div>
                                )}
                            </div>
                        </Link>
                    </div>
                </div>
            </header>
            <div className="header-spacer"></div>
        </>
    )
}