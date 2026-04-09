import React from "react";
import Hero from "../Components/Hero/index.jsx";
import BouquetsCard from "../Components/FlowersCard/Index.jsx";
import AtelierCTACard from "../Components/AtelierCTACard/Index.jsx";
import './home.scss'
import { useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { fetchBouquet } from "../../redux/slices/bouqetsSlice.js";
import { fetchFlowers } from "../../redux/slices/flowersSlice.js";
import { setPriceRange, setSort } from "../../redux/slices/filterSlice.js";
import { EmptyState, ProductCardSkeleton } from "../../components/EdgeStates";
import PageTransition from "../../components/animations/PageTransition.jsx";
import FadeInUp from "../../components/animations/FadeInUp.jsx";
import FilterBar from "../../components/filters/FilterBar.jsx";
import { motion, AnimatePresence } from "framer-motion";

export const Home = () => {
    const dispatch = useDispatch()
    const { bouquets, loading: bouquetsLoading } = useSelector((state) => state.bouquets)
    const { flowers, loading: flowersLoading } = useSelector((state) => state.flowers)
    const { minPrice, maxPrice, sortBy, sortDir } = useSelector((state) => state.filter);

    // Local state for category selection
    const [selectedCategory, setSelectedCategory] = useState('all');

    const isLoading = bouquetsLoading || flowersLoading;

    useEffect(() => {
        dispatch(fetchBouquet())
        dispatch(fetchFlowers())
    }, [dispatch])

    const safeBouquets = Array.isArray(bouquets) ? bouquets : []
    const safeFlowers = Array.isArray(flowers) ? flowers : []

    // Combine products with type tags
    const allProducts = useMemo(() => {
        const bouquetProducts = safeBouquets.map(b => ({ ...b, productType: 'bouquet' }));
        const flowerProducts = safeFlowers.map(f => ({ ...f, productType: 'flower' }));
        return [...flowerProducts, ...bouquetProducts];
    }, [safeBouquets, safeFlowers]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        try {
            let result = [...allProducts];

            // Category filter
            switch (selectedCategory) {
                case 'bouquets':
                    result = result.filter(p => p.productType === 'bouquet');
                    break;
                case 'flowers':
                    result = result.filter(p => p.productType === 'flower');
                    break;
                case 'wedding':
                    // Placeholder: filter by occasion tag when backend supports it
                    result = result.filter(p => p.name?.toLowerCase().includes('wedding') || p.productType === 'bouquet');
                    break;
                case 'gifts':
                    // Placeholder: filter by occasion tag when backend supports it
                    result = result.filter(p => p.name?.toLowerCase().includes('gift') || p.productType === 'bouquet');
                    break;
                default:
                    // 'all' - no filter
                    break;
            }

            // Price filter
            if (minPrice !== null && minPrice !== undefined) {
                result = result.filter(p => (p.price || 0) >= minPrice);
            }
            if (maxPrice !== null && maxPrice !== undefined) {
                result = result.filter(p => (p.price || 0) <= maxPrice);
            }

            // Sort
            result.sort((a, b) => {
                let aVal = a[sortBy];
                let bVal = b[sortBy];

                // Fallback for missing values to prevent crash
                if (aVal === undefined || aVal === null) aVal = '';
                if (bVal === undefined || bVal === null) bVal = '';

                // Handle string comparison for non-numeric fields
                if (typeof aVal === 'string' || typeof bVal === 'string') {
                    const sA = String(aVal).toLowerCase();
                    const sB = String(bVal).toLowerCase();
                    
                    if (sortDir === 'asc') {
                        return sA.localeCompare(sB);
                    } else {
                        return sB.localeCompare(sA);
                    }
                }

                // Numeric comparison
                if (sortDir === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });

            return result;
        } catch (error) {
            console.error("Error filtering/sorting products:", error);
            return allProducts; // Fallback to unfiltered list instead of crashing
        }
    }, [allProducts, selectedCategory, minPrice, maxPrice, sortBy, sortDir]);

    const handlePriceChange = (range) => {
        dispatch(setPriceRange(range));
    };

    const handleSortChange = (sortConfig) => {
        dispatch(setSort(sortConfig));
    };

    // Render loading skeletons
    const renderSkeletons = () => (
        Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} index={index} />
        ))
    );

    // Render empty state for no results after filtering
    const renderEmptyState = () => (
        <EmptyState
            icon={Search}
            title="No flowers found"
            message="We couldn't find any arrangements matching your filters. Try adjusting your criteria."
            actionButton={{
                label: "Clear Filters",
                onClick: () => {
                    setSelectedCategory('all');
                    dispatch(setPriceRange({ min: null, max: null }));
                }
            }}
        />
    );

    // Animation variants for product cards
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 }
    };

    return (
        <PageTransition>
            <main className="main-home">
                <Hero />

                <section className="products-section">
                    <FadeInUp>
                        <div className="products-section__header">
                            <h2>Our Collections</h2>
                            <p>Discover handcrafted arrangements for every occasion</p>
                        </div>
                    </FadeInUp>

                    <FilterBar
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                        currentSort={{ sortBy, sortDir }}
                        onSortChange={handleSortChange}
                        priceRange={{ min: minPrice, max: maxPrice }}
                        onPriceChange={handlePriceChange}
                    />

                    {isLoading ? (
                        <div className="products-grid">
                            {renderSkeletons()}
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <motion.div
                            className="products-grid"
                            layout
                        >
                            <AnimatePresence mode="popLayout">
                                {/* CTA Card — first item in the grid */}
                                <motion.div
                                    key="atelier-cta"
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    layout
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                >
                                    <AtelierCTACard />
                                </motion.div>

                                {filteredProducts.map((product) => (
                                    <motion.div
                                        key={`${product.productType}-${product.id}`}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        layout
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    >
                                        <BouquetsCard product={product} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        renderEmptyState()
                    )}
                </section>
            </main>
        </PageTransition>
    )
}
