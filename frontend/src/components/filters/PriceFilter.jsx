import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import './FilterBar.scss';

const PriceFilter = ({ priceRange, onPriceChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [minPrice, setMinPrice] = useState(priceRange.min || '');
    const [maxPrice, setMaxPrice] = useState(priceRange.max || '');
    const panelRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleApply = () => {
        onPriceChange({
            min: minPrice ? Number(minPrice) : null,
            max: maxPrice ? Number(maxPrice) : null,
        });
        setIsOpen(false);
    };

    const handleClear = () => {
        setMinPrice('');
        setMaxPrice('');
        onPriceChange({ min: null, max: null });
        setIsOpen(false);
    };

    const hasActiveFilter = priceRange.min !== null || priceRange.max !== null;

    return (
        <div className="price-filter" ref={panelRef}>
            <button
                className={`price-filter__trigger ${hasActiveFilter ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <SlidersHorizontal size={16} />
                <span>
                    {hasActiveFilter
                        ? `$${priceRange.min || 0} - $${priceRange.max || '∞'}`
                        : 'Price'}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="price-filter__panel"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="price-filter__header">
                            <span>Price Range</span>
                            <button
                                className="price-filter__close"
                                onClick={() => setIsOpen(false)}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="price-filter__inputs">
                            <div className="price-filter__input-group">
                                <label>Min</label>
                                <div className="price-filter__input-wrapper">
                                    <span>$</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div className="price-filter__divider">–</div>
                            <div className="price-filter__input-group">
                                <label>Max</label>
                                <div className="price-filter__input-wrapper">
                                    <span>$</span>
                                    <input
                                        type="number"
                                        placeholder="1000"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="price-filter__actions">
                            <button
                                className="price-filter__btn price-filter__btn--clear"
                                onClick={handleClear}
                            >
                                Clear
                            </button>
                            <button
                                className="price-filter__btn price-filter__btn--apply"
                                onClick={handleApply}
                            >
                                Apply
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PriceFilter;
