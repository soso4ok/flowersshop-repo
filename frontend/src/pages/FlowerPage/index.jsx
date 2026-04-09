import React from 'react';
import './flowersPage.scss'
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../redux/slices/cartSlice.js";

import PageTransition from "../../components/animations/PageTransition.jsx";
import FadeInUp from "../../components/animations/FadeInUp.jsx";
import { motion } from "framer-motion";

export const FlowerPage = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const product = location.state?.product;

    const handleAddToCart = () => {
        dispatch(addItemToCart(product));
    };

    const imageUrl = product?.image?.imageId
        ? `${import.meta.env.VITE_API_KEY}/products/images/${product.image.imageId}`
        : 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80';

    // Generate thumbnail variations (using same image for now)
    const thumbnails = [imageUrl, imageUrl, imageUrl];

    if (!product) {
        return (
            <PageTransition>
                <div className="product-page">
                    <div className="product-page__error">
                        <h2>Product not found</h2>
                        <p>The product you're looking for doesn't exist.</p>
                    </div>
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <div className="product-page">

                <main className="product-page__main">
                    <div className="product-page__container">
                        {/* Left Column - Imagery */}
                        <motion.div
                            className="product-page__gallery"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="product-page__main-image">
                                <motion.img
                                    src={imageUrl}
                                    alt={product.name}
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.6 }}
                                />
                            </div>
                            <div className="product-page__thumbnails">
                                {thumbnails.map((thumb, index) => (
                                    <button key={index} className="product-page__thumbnail">
                                        <img src={thumb} alt={`View ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right Column - Product Info */}
                        <FadeInUp delay={0.2}>
                            <div className="product-page__info">
                                <div className="product-page__info-content">
                                    <h1 className="product-page__title">
                                        {product.name || 'The Velvet Rose Bouquet'}
                                    </h1>

                                    <div className="product-page__price">
                                        ${product.price}
                                    </div>

                                    <div className="product-page__description">
                                        <p>{product.description || 'A beautiful handcrafted bouquet featuring premium roses, delicate greenery, and seasonal accents. Perfect for expressing love, celebrating milestones, or brightening someone\'s day.'}</p>
                                    </div>

                                    <div className="product-page__details">
                                        <div className="product-page__detail">
                                            <span className="product-page__detail-label">Availability</span>
                                            <span className="product-page__detail-value">
                                                {product.available === 'true' || product.available === true ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                        <div className="product-page__detail">
                                            <span className="product-page__detail-label">Delivery</span>
                                            <span className="product-page__detail-value">Same Day Available</span>
                                        </div>
                                    </div>

                                    <motion.button
                                        className="product-page__add-to-cart"
                                        onClick={handleAddToCart}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Add to Cart
                                    </motion.button>

                                    <div className="product-page__care">
                                        <h4>Care Instructions</h4>
                                        <ul>
                                            <li>Keep in a cool location away from direct sunlight</li>
                                            <li>Change water every 2-3 days</li>
                                            <li>Trim stems at an angle for better water absorption</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </FadeInUp>
                    </div>
                </main>
            </div>
        </PageTransition>
    )
}