import './Builder.scss';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlowers } from '../../redux/slices/flowersSlice.js';
import {
    addItem,
    removeItem,
    clearBuilder,
    selectBuilderItems,
    selectBuilderTotalPrice,
    selectBuilderIsValid,
    selectBuilderTotalCount,
} from '../../redux/slices/builderSlice.js';
import { addCustomBouquet } from '../../redux/slices/cartSlice.js';
import { useToast } from '../../components/EdgeStates';
import PageTransition from '../../components/animations/PageTransition.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, ShoppingBag, Flower2, Leaf, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
    { key: 'flowers', label: 'Flowers', icon: Flower2 },
    { key: 'greenery', label: 'Greenery', icon: Leaf },
    { key: 'packaging', label: 'Packaging', icon: Package },
];

const MIN_ITEMS = 3;

// Simple heuristic to assign categories to products for demo purposes
const categorizeProduct = (product) => {
    const name = (product.name || '').toLowerCase();
    if (name.includes('green') || name.includes('eucalyptus') || name.includes('fern') || name.includes('leaf')) {
        return 'greenery';
    }
    if (name.includes('wrap') || name.includes('ribbon') || name.includes('box') || name.includes('paper') || name.includes('pack')) {
        return 'packaging';
    }
    return 'flowers';
};

const Builder = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();

    const { flowers, loading } = useSelector((state) => state.flowers);
    const builderItems = useSelector(selectBuilderItems);
    const totalPrice = useSelector(selectBuilderTotalPrice);
    const isValid = useSelector(selectBuilderIsValid);
    const totalCount = useSelector(selectBuilderTotalCount);

    const [activeTab, setActiveTab] = useState('flowers');

    useEffect(() => {
        dispatch(fetchFlowers());
    }, [dispatch]);

    const safeFlowers = Array.isArray(flowers) ? flowers : [];
    const categorized = safeFlowers.map((f) => ({
        ...f,
        category: categorizeProduct(f),
    }));
    const filteredProducts = categorized.filter((p) => p.category === activeTab);

    const handleAdd = (product) => {
        dispatch(addItem(product));
    };

    const handleRemove = (itemId) => {
        dispatch(removeItem(itemId));
    };

    const handleAddToCart = () => {
        if (!isValid) return;
        dispatch(
            addCustomBouquet({
                items: builderItems,
                totalPrice,
            })
        );
        dispatch(clearBuilder());
        toast.success('Custom bouquet added to cart!');
        navigate('/cart');
    };

    const getImageUrl = (product) => {
        return product.image?.imageId
            ? `${import.meta.env.VITE_API_KEY}/products/images/${product.image.imageId}`
            : 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80';
    };

    const progress = Math.min(totalCount / MIN_ITEMS, 1);

    return (
        <PageTransition>
            <div className="builder-page">
                <div className="builder-page__header">
                    <h1>Bouquet Builder</h1>
                    <p>Compose your dream arrangement stem by stem</p>
                </div>

                <div className="builder-page__layout">
                    {/* ======= CATALOG AREA ======= */}
                    <div className="builder-catalog">
                        <div className="builder-catalog__tabs">
                            {CATEGORIES.map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    className={`builder-catalog__tab ${activeTab === key ? 'builder-catalog__tab--active' : ''}`}
                                    onClick={() => setActiveTab(key)}
                                >
                                    <Icon size={18} />
                                    {label}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div className="builder-catalog__grid">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="builder-card builder-card--skeleton">
                                        <div className="builder-card__img-skeleton" />
                                        <div className="builder-card__text-skeleton" />
                                        <div className="builder-card__text-skeleton builder-card__text-skeleton--short" />
                                    </div>
                                ))}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <motion.div className="builder-catalog__grid" layout>
                                <AnimatePresence mode="popLayout">
                                    {filteredProducts.map((product) => {
                                        const inBuilder = builderItems.find((b) => b.id === product.id);
                                        return (
                                            <motion.div
                                                key={product.id}
                                                className="builder-card"
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.25 }}
                                            >
                                                <div className="builder-card__image-wrapper">
                                                    <img
                                                        src={getImageUrl(product)}
                                                        alt={product.name}
                                                        className="builder-card__image"
                                                    />
                                                    {inBuilder && (
                                                        <span className="builder-card__badge">
                                                            {inBuilder.count}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="builder-card__info">
                                                    <h4 className="builder-card__name">{product.name}</h4>
                                                    <span className="builder-card__price">${product.price}</span>
                                                </div>
                                                <motion.button
                                                    className="builder-card__add-btn"
                                                    onClick={() => handleAdd(product)}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.92 }}
                                                >
                                                    <Plus size={16} />
                                                    Add Stem
                                                </motion.button>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <div className="builder-catalog__empty">
                                <p>No items in this category yet.</p>
                            </div>
                        )}
                    </div>

                    {/* ======= STICKY BUILDER PANEL ======= */}
                    <div className="builder-panel">
                        <div className="builder-panel__inner">
                            <h2 className="builder-panel__title">
                                <Flower2 size={22} />
                                Your Bouquet
                            </h2>

                            {/* Progress bar */}
                            <div className="builder-panel__progress-section">
                                <div className="builder-panel__progress-bar">
                                    <motion.div
                                        className="builder-panel__progress-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress * 100}%` }}
                                        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                                    />
                                </div>
                                <span className="builder-panel__progress-label">
                                    {totalCount < MIN_ITEMS
                                        ? `Add ${MIN_ITEMS - totalCount} more item${MIN_ITEMS - totalCount > 1 ? 's' : ''} to unlock`
                                        : '✓ Ready to add to cart'}
                                </span>
                            </div>

                            {/* Items list */}
                            <div className="builder-panel__items">
                                <AnimatePresence>
                                    {builderItems.length === 0 ? (
                                        <motion.p
                                            className="builder-panel__empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            Pick flowers from the catalog to get started
                                        </motion.p>
                                    ) : (
                                        builderItems.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                className="builder-panel__item"
                                                layout
                                                initial={{ opacity: 0, x: 30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -30, height: 0 }}
                                                transition={{ duration: 0.25 }}
                                            >
                                                <img
                                                    src={getImageUrl(item)}
                                                    alt={item.name}
                                                    className="builder-panel__item-img"
                                                />
                                                <div className="builder-panel__item-info">
                                                    <span className="builder-panel__item-name">{item.name}</span>
                                                    <span className="builder-panel__item-price">
                                                        ${(item.price * item.count).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="builder-panel__item-controls">
                                                    <button
                                                        className="builder-panel__item-btn"
                                                        onClick={() => handleRemove(item.id)}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="builder-panel__item-count">{item.count}</span>
                                                    <button
                                                        className="builder-panel__item-btn"
                                                        onClick={() => handleAdd(item)}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Totals + CTA */}
                            <div className="builder-panel__footer">
                                {builderItems.length > 0 && (
                                    <button
                                        className="builder-panel__clear"
                                        onClick={() => dispatch(clearBuilder())}
                                    >
                                        <Trash2 size={14} />
                                        Clear All
                                    </button>
                                )}
                                <div className="builder-panel__total">
                                    <span>Total</span>
                                    <span className="builder-panel__total-price">${totalPrice.toFixed(2)}</span>
                                </div>
                                <motion.button
                                    className="builder-panel__cta btn-primary"
                                    disabled={!isValid}
                                    onClick={handleAddToCart}
                                    whileHover={isValid ? { scale: 1.02 } : {}}
                                    whileTap={isValid ? { scale: 0.98 } : {}}
                                >
                                    <ShoppingBag size={18} />
                                    {isValid ? 'Add Bouquet to Cart' : `Min. ${MIN_ITEMS} items required`}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Builder;
