import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    User,
    ShoppingBag,
    Heart,
    LogOut,
    ChevronRight
} from 'lucide-react';

const UserMenu = ({ isOpen, onClose, user, onLogout }) => {
    const menuItems = [
        { label: 'My Profile', icon: User, path: '/profile' },
        { label: 'My Orders', icon: ShoppingBag, path: '/orders' },
        { label: 'Wishlist', icon: Heart, path: '/wishlist' },
    ];

    const getInitials = () => {
        if (!user.firstName && !user.lastName) return 'U';
        return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="user-popover"
                >
                    <div className="user-popover__header">
                        <div className="user-popover__avatar">
                            {user.photo ? (
                                <img src={user.photo} alt={user.firstName} />
                            ) : (
                                <span>{getInitials()}</span>
                            )}
                        </div>
                        <div className="user-popover__info">
                            <p className="user-popover__name">{user.firstName} {user.lastName}</p>
                            <p className="user-popover__email">{user.email}</p>
                        </div>
                    </div>

                    <div className="user-popover__divider" />

                    <div className="user-popover__menu">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                className="user-popover__item"
                                onClick={onClose}
                            >
                                <item.icon size={18} strokeWidth={1.5} className="user-popover__icon" />
                                <span>{item.label}</span>
                                <ChevronRight size={14} strokeWidth={2} className="user-popover__chevron" />
                            </Link>
                        ))}
                    </div>

                    <div className="user-popover__divider" />

                    <div className="user-popover__footer">
                        <button
                            className="user-popover__item user-popover__item--logout"
                            onClick={onLogout}
                        >
                            <LogOut size={18} strokeWidth={1.5} className="user-popover__icon" />
                            <span>Logout</span>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UserMenu;
