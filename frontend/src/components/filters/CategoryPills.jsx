import React from 'react';
import { motion } from 'framer-motion';
import './FilterBar.scss';

const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'bouquets', label: 'Bouquets' },
    { id: 'flowers', label: 'Single Flowers' },
    { id: 'wedding', label: 'Wedding' },
    { id: 'gifts', label: 'Gifts' },
];

const CategoryPills = ({ selectedCategory, onSelectCategory }) => {
    return (
        <div className="category-pills">
            {CATEGORIES.map((category) => (
                <motion.button
                    key={category.id}
                    className={`category-pill ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => onSelectCategory(category.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                >
                    {category.label}
                </motion.button>
            ))}
        </div>
    );
};

export default CategoryPills;
