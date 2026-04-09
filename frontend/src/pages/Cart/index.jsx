import React from 'react';
import './Cart.scss'
import { useDispatch, useSelector } from "react-redux";
import { changeItemCount, removeItem } from "../../redux/slices/cartSlice.js";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Flower2, ChevronDown, ChevronUp } from "lucide-react";
import { EmptyState } from "../../components/EdgeStates";
import PageTransition from "../../components/animations/PageTransition.jsx";
import StaggerGrid from "../../components/animations/StaggerGrid.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

/* ── Sub-component: Custom Bouquet Cart Card ── */
const CustomBouquetCard = ({ item, onRemove }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="cart-item cart-item--custom-bouquet">
            <div className="cart-item__details">
                <span className="cart-item__custom-label">
                    <Flower2 size={14} />
                    Custom Bouquet
                </span>
                <h3 className="cart-item__name">{item.name}</h3>
                <span className="cart-item__price">${item.price.toFixed(2)}</span>

                <button
                    className="cart-item__contents-toggle"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {item.items.length} items inside
                </button>

                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            className="cart-item__contents"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            style={{ overflow: 'hidden' }}
                        >
                            {item.items.map((flower) => {
                                const price = Number(flower.price) || 0;
                                const count = Number(flower.count) || 0;
                                return (
                                    <div key={flower.id} className="cart-item__contents-flower">
                                        <span>{flower.name} × {count}</span>
                                        <span>${(price * count).toFixed(2)}</span>
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <button
                className="cart-item__remove"
                onClick={() => onRemove(item.id)}
            >
                Remove
            </button>
        </div>
    );
};

const Cart = () => {
    const { items, totalPrice } = useSelector((state) => state.cart);
    const { isAuthenticated } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleProceedToCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    const handleChangeCount = (itemId, add) => {
        dispatch(changeItemCount({ itemId, add }));
    };

    const handleRemoveItem = (itemId) => {
        dispatch(removeItem(itemId));
    };

    const getImageUrl = (item) => {
        const apiKey = import.meta.env.VITE_API_KEY || '';
        return item.image?.imageId && apiKey
            ? `${apiKey}/products/images/${item.image.imageId}`
            : 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=200&q=80';
    };
 
    const subtotal = Number(totalPrice) || 0;

    return (
        <PageTransition>
            <div className="cart-page">

                <main className="cart">
                    <div className={`cart__container ${items.length === 0 ? 'cart__container--empty' : ''}`}>
                        {/* Left Column - Cart Items */}
                        <div className={`cart__items-section ${items.length === 0 ? 'cart__items-section--empty' : ''}`}>
                            {items.length > 0 && <h1 className="cart__title">Your Selection</h1>}

                            {items.length === 0 ? (
                                <EmptyState
                                    icon={ShoppingBag}
                                    title="Your cart is empty"
                                    message="Looks like you haven't added any beautiful arrangements yet. Explore our curated collection."
                                    actionButton={{
                                        label: "Explore Collection",
                                        href: "/"
                                    }}
                                />
                            ) : (
                                <StaggerGrid className="cart__items">
                                    {items.map((item) =>
                                        item.type === 'CUSTOM_BOUQUET' ? (
                                            <CustomBouquetCard
                                                key={item.id}
                                                item={item}
                                                onRemove={handleRemoveItem}
                                            />
                                        ) : (
                                            <div key={item.id} className="cart-item">
                                                <div className="cart-item__image">
                                                    <img src={getImageUrl(item)} alt={item.name} />
                                                </div>

                                                <div className="cart-item__details">
                                                    <h3 className="cart-item__name">{item.name}</h3>
                                                    <span className="cart-item__price">${item.price}</span>
                                                </div>

                                                <div className="cart-item__quantity">
                                                    <motion.button
                                                        className="cart-item__qty-btn"
                                                        onClick={() => handleChangeCount(item.id, false)}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <svg width="16" height="2" viewBox="0 0 16 2" fill="none">
                                                            <path d="M1 1H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                        </svg>
                                                    </motion.button>
                                                    <span className="cart-item__qty-value">{item.count}</span>
                                                    <motion.button
                                                        className="cart-item__qty-btn"
                                                        onClick={() => handleChangeCount(item.id, true)}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path d="M8 1V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                            <path d="M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                        </svg>
                                                    </motion.button>
                                                </div>

                                                <button
                                                    className="cart-item__remove"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )
                                    )}
                                </StaggerGrid>
                            )}
                        </div>

                        {/* Right Column - Order Summary */}
                        {items.length > 0 && (
                            <motion.div
                                className="cart__summary"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="order-summary">
                                    <h2 className="order-summary__title">Order Summary</h2>

                                    <div className="order-summary__rows">
                                        <div className="order-summary__row">
                                            <span>Subtotal</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="order-summary__row">
                                            <span>Shipping</span>
                                            <span className="order-summary__shipping">Calculated at next step</span>
                                        </div>
                                    </div>

                                    <div className="order-summary__total">
                                        <span>Total</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>

                                    <motion.button
                                        className="order-summary__checkout"
                                        onClick={handleProceedToCheckout}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Proceed to Checkout
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>
        </PageTransition>
    );
};

export default Cart;

