import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites } from '../../redux/slices/favoritesSlice.js';
import { Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import BouquetsCard from '../Components/FlowersCard/Index.jsx';
import PageTransition from '../../components/animations/PageTransition.jsx';
import FadeInUp from '../../components/animations/FadeInUp.jsx';
import './Wishlist.scss';

const Wishlist = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.favorites);
    const { isAuthenticated } = useSelector((state) => state.user);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchFavorites());
        }
    }, [dispatch, isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <PageTransition>
                <div className="wishlist-empty">
                    <Heart size={48} className="wishlist-empty__icon" />
                    <h2>Please sign in</h2>
                    <p>Login to view and manage your favorited items.</p>
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <main className="wishlist-page">
                <section className="wishlist-hero">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="wishlist-hero__content"
                    >
                        <span className="wishlist-hero__subtitle">Your Curated Collection</span>
                        <h1 className="wishlist-hero__title">Wishlist</h1>
                        <p className="wishlist-hero__description">
                            A personal selection of your favorite arrangements and blooms.
                        </p>
                    </motion.div>
                </section>

                <div className="wishlist-container">
                    {loading ? (
                        <div className="wishlist-loading">
                            <div className="spinner"></div>
                            <p>Loading your favorites...</p>
                        </div>
                    ) : items.length > 0 ? (
                        <div className="products-grid">
                            {items.map((product) => (
                                <BouquetsCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <FadeInUp className="wishlist-empty">
                            <div className="wishlist-empty__icon-wrapper">
                                <Heart size={40} strokeWidth={1.5} />
                            </div>
                            <h2>Your wishlist is empty</h2>
                            <p>Start exploring our collections and save the blooms that catch your eye.</p>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => window.location.href = '/'}
                                className="wishlist-empty__btn"
                            >
                                <Sparkles size={16} />
                                <span>Explore Collections</span>
                            </motion.button>
                        </FadeInUp>
                    )}
                </div>
            </main>
        </PageTransition>
    );
};

export default Wishlist;
