import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import './FilterBar.scss';

const SORT_OPTIONS = [
    { id: 'newest', label: 'Newest', sortBy: 'id', sortDir: 'desc' },
    { id: 'price-asc', label: 'Price: Low → High', sortBy: 'price', sortDir: 'asc' },
    { id: 'price-desc', label: 'Price: High → Low', sortBy: 'price', sortDir: 'desc' },
];

const SortDropdown = ({ currentSort, onSortChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentOption = SORT_OPTIONS.find(
        (opt) => opt.sortBy === currentSort.sortBy && opt.sortDir === currentSort.sortDir
    ) || SORT_OPTIONS[0];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onSortChange({ sortBy: option.sortBy, sortDir: option.sortDir });
        setIsOpen(false);
    };

    return (
        <div className="sort-dropdown" ref={dropdownRef}>
            <button
                className="sort-dropdown__trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>Sort by: {currentOption.label}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={16} />
                </motion.span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="sort-dropdown__menu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {SORT_OPTIONS.map((option) => (
                            <button
                                key={option.id}
                                className={`sort-dropdown__item ${currentOption.id === option.id ? 'active' : ''}`}
                                onClick={() => handleSelect(option)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SortDropdown;
