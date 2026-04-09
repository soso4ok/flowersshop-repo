import React from 'react';
import './flowersCard.scss'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../../redux/slices/cartSlice.js";
import { addFavorite, removeFavorite } from "../../../redux/slices/favoritesSlice.js";
import { useToast } from "../../../components/EdgeStates";
import { motion } from "framer-motion";

function BouquetsCard({ product }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { isAuthenticated } = useSelector((state) => state.user);
    const favoriteIds = useSelector((state) => state.favorites.ids);

    const isFavorite = product?.id ? favoriteIds.includes(product.id) : false;

    const handleAddToCart = (event) => {
        if (!product) return;
        event.preventDefault();
        event.stopPropagation();
        dispatch(addItemToCart(product));
        toast.success(`${product.name || 'Item'} added to cart`);
    }

    const handleToggleFavorite = (event) => {
        if (!product?.id) return;
        event.preventDefault();
        event.stopPropagation();

        if (!isAuthenticated) {
            toast.info('Please sign in to save favorites');
            navigate('/login');
            return;
        }

        if (isFavorite) {
            dispatch(removeFavorite(product.id));
            toast.success(`${product.name || 'Item'} removed from favorites`);
        } else {
            dispatch(addFavorite(product.id));
            toast.success(`${product.name || 'Item'} added to favorites`);
        }
    }

    const apiKey = import.meta.env.VITE_API_KEY || '';
    const imageUrl = product?.image?.imageId && apiKey
        ? `${apiKey}/products/images/${product.image.imageId}`
        : 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80';

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Link
                key={product.id}
                to={`/product/${product.id}`}
                state={{ product: product }}
                className="product-card"
            >
                <div className="product-card__image-wrapper">
                    <motion.img
                        src={imageUrl}
                        alt={product.name}
                        className="product-card__image"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    />

                    {/* Favorite (Heart) Button */}
                    <motion.button
                        className={`product-card__fav-btn ${isFavorite ? 'product-card__fav-btn--active' : ''}`}
                        onClick={handleToggleFavorite}
                        whileTap={{ scale: 0.85 }}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                            fill={isFavorite ? 'currentColor' : 'none'}
                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </motion.button>

                    <motion.button
                        className="product-card__add-btn"
                        onClick={handleAddToCart}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add to Cart
                    </motion.button>
                </div>

                <div className="product-card__info">
                    <h3 className="product-card__name">{product.name}</h3>
                    <div className="product-card__price-row">
                        <span className="product-card__price">${product.price}</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default BouquetsCard;