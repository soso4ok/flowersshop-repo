import React from 'react';
import CategoryPills from './CategoryPills';
import SortDropdown from './SortDropdown';
import PriceFilter from './PriceFilter';
import './FilterBar.scss';

const FilterBar = ({
    selectedCategory,
    onSelectCategory,
    currentSort,
    onSortChange,
    priceRange,
    onPriceChange,
}) => {
    return (
        <div className="filter-bar">
            <div className="filter-bar__left">
                <CategoryPills
                    selectedCategory={selectedCategory}
                    onSelectCategory={onSelectCategory}
                />
            </div>
            <div className="filter-bar__right">
                <SortDropdown
                    currentSort={currentSort}
                    onSortChange={onSortChange}
                />
                <PriceFilter
                    priceRange={priceRange}
                    onPriceChange={onPriceChange}
                />
            </div>
        </div>
    );
};

export default FilterBar;
