import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBlogs } from '../../redux/slices/blogSlice';
import { motion } from 'framer-motion';
import './blog.scss';

// Helper to format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Helper to calculate read time
const calculateReadTime = (content) => {
    if (!content) return '3 min read';
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
};

// Helper to get fallback image
const getFallbackImage = (id) => {
    const images = [
        'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1518882605630-8eb0a8ee89dd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&h=600&fit=crop',
    ];
    return images[(id || 0) % images.length];
};

// Helper to get backend image URL
const getImageUrl = (image) => {
    if (image?.imageId) {
        const baseUrl = import.meta.env.VITE_API_KEY || 'http://localhost:8080/api/v1';
        return `${baseUrl}/products/images/${image.imageId}`;
    }
    return null;
};

// Blog Card Component
const BlogCard = ({ blog, index, featured = false }) => {
    const imageUrl = getImageUrl(blog.image) || getFallbackImage(blog.id);

    return (
        <motion.article
            className={`blog-card ${featured ? 'blog-card--featured' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
        >
            <Link to={`/blog/${blog.id}`} className="blog-card__link">
                <div className="blog-card__image-wrapper">
                    <img
                        src={imageUrl}
                        alt={blog.title}
                        className="blog-card__image"
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = getFallbackImage(blog.id);
                        }}
                    />
                    <div className="blog-card__overlay" />
                </div>
                <div className="blog-card__content">
                    <span className="blog-card__category">Floristry</span>
                    <h2 className="blog-card__title">{blog.title}</h2>
                    <p className="blog-card__excerpt">
                        {blog.content?.substring(0, 120)}...
                    </p>
                    <div className="blog-card__meta">
                        <span className="blog-card__date">{formatDate(blog.createdAt)}</span>
                        <span className="blog-card__separator">•</span>
                        <span className="blog-card__read-time">{calculateReadTime(blog.content)}</span>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
};

const Blog = () => {
    const dispatch = useDispatch();
    const { blogs, status } = useSelector((state) => state.blogs);

    useEffect(() => {
        dispatch(fetchBlogs());
    }, [dispatch]);

    // Get featured post (first one) and rest
    const featuredPost = blogs[0];
    const regularPosts = blogs.slice(1);

    return (
        <motion.main
            className="blog-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Hero Section */}
            <section className="blog-page__hero">
                <motion.span
                    className="blog-page__label"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    Our Journal
                </motion.span>
                <motion.h1
                    className="blog-page__title"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Stories & Inspirations
                </motion.h1>
                <motion.p
                    className="blog-page__subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Discover the art of floristry, seasonal trends, and the stories behind our bouquets.
                </motion.p>
            </section>

            {/* Content */}
            {status === 'loading' && (
                <div className="blog-page__loading">
                    <div className="blog-page__spinner"></div>
                    <p>Loading articles...</p>
                </div>
            )}

            {status === 'failed' && (
                <div className="blog-page__error">
                    <p>Unable to load articles. Please try again later.</p>
                </div>
            )}

            {status === 'succeeded' && blogs.length > 0 && (
                <>
                    {/* Featured Post */}
                    {featuredPost && (
                        <section className="blog-page__featured">
                            <BlogCard blog={featuredPost} index={0} featured={true} />
                        </section>
                    )}

                    {/* Blog Grid */}
                    {regularPosts.length > 0 && (
                        <section className="blog-page__grid-section">
                            <div className="blog-page__grid">
                                {regularPosts.map((blog, index) => (
                                    <BlogCard key={blog.id} blog={blog} index={index + 1} />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}

            {status === 'succeeded' && blogs.length === 0 && (
                <div className="blog-page__empty">
                    <h3>No articles yet</h3>
                    <p>Check back soon for inspiring content about floristry and our collections.</p>
                </div>
            )}
        </motion.main>
    );
};

export default Blog;
