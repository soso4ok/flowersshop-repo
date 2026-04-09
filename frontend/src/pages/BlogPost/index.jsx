import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogById, fetchBlogs, clearCurrentBlog } from '../../redux/slices/blogSlice';
import { motion, useScroll, useTransform } from 'framer-motion';
import './blogPost.scss';

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

// Helper to get backend image URL
const getImageUrl = (image) => {
    if (image?.imageId) {
        const baseUrl = import.meta.env.VITE_API_KEY || 'http://localhost:8080/api/v1';
        return `${baseUrl}/products/images/${image.imageId}`;
    }
    return null;
};

// Helper to get fallback image based on content
const getFallbackImage = (id) => {
    const images = [
        'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1600&h=900&fit=crop&q=80',
        'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1600&h=900&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518882605630-8eb0a8ee89dd?w=1600&h=900&fit=crop&q=80',
        'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=1600&h=900&fit=crop&q=80',
        'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=1600&h=900&fit=crop&q=80',
    ];
    return images[(id || 0) % images.length];
};

// Drop cap component for first paragraph
const DropCapText = ({ content }) => {
    if (!content || content.length === 0) return null;

    const firstLetter = content.charAt(0);
    const restOfContent = content.slice(1);

    return (
        <p className="blog-post__intro">
            <span className="blog-post__drop-cap">{firstLetter}</span>
            {restOfContent}
        </p>
    );
};

// Related blog card component
const RelatedBlogCard = ({ blog }) => {
    const imageUrl = getImageUrl(blog.image) || getFallbackImage(blog.id);

    return (
        <Link to={`/blog/${blog.id}`} className="related-card">
            <div className="related-card__image-wrapper">
                <img
                    src={imageUrl}
                    alt={blog.title}
                    className="related-card__image"
                    onError={(e) => {
                        e.target.src = getFallbackImage(blog.id);
                    }}
                />
            </div>
            <div className="related-card__content">
                <span className="related-card__category">Floristry</span>
                <h3 className="related-card__title">{blog.title}</h3>
                <span className="related-card__date">{formatDate(blog.createdAt)}</span>
            </div>
        </Link>
    );
};

const BlogPost = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentBlog, currentBlogStatus, blogs, status } = useSelector((state) => state.blogs);

    // Parallax scroll effect
    const { scrollY } = useScroll();
    const imageY = useTransform(scrollY, [0, 500], [0, 150]);
    const imageScale = useTransform(scrollY, [0, 500], [1.1, 1]);

    useEffect(() => {
        dispatch(fetchBlogById(id));

        // Also fetch all blogs for related posts
        if (status === 'idle' || blogs.length === 0) {
            dispatch(fetchBlogs());
        }

        // Cleanup on unmount
        return () => {
            dispatch(clearCurrentBlog());
        };
    }, [dispatch, id, status, blogs.length]);

    // Get related posts (excluding current)
    const relatedPosts = useMemo(() => {
        return blogs
            .filter(blog => blog.id !== parseInt(id))
            .slice(0, 2);
    }, [blogs, id]);

    // Image URL with fallback
    const heroImageUrl = useMemo(() => {
        return getImageUrl(currentBlog?.image) || getFallbackImage(currentBlog?.id);
    }, [currentBlog]);

    // Loading state
    if (currentBlogStatus === 'loading') {
        return (
            <main className="blog-post blog-post--loading">
                <div className="blog-post__loading-container">
                    <div className="blog-post__loading-spinner"></div>
                    <p>Loading article...</p>
                </div>
            </main>
        );
    }

    // Error state
    if (currentBlogStatus === 'failed' || !currentBlog) {
        return (
            <main className="blog-post blog-post--error">
                <div className="blog-post__error-container">
                    <h2>Article not found</h2>
                    <p>The article you're looking for doesn't exist or has been removed.</p>
                    <Link to="/blog" className="btn-primary">
                        Back to Blog
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <motion.main
            className="blog-post"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Hero Section */}
            <header className="blog-post__header">
                <div className="blog-post__header-content">
                    <motion.span
                        className="blog-post__category"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Floristry
                    </motion.span>

                    <motion.h1
                        className="blog-post__title"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        {currentBlog.title}
                    </motion.h1>

                    <motion.div
                        className="blog-post__meta"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="blog-post__author">Written by Floralia Team</span>
                        <span className="blog-post__separator">•</span>
                        <span className="blog-post__date">{formatDate(currentBlog.createdAt)}</span>
                        <span className="blog-post__separator">•</span>
                        <span className="blog-post__read-time">{calculateReadTime(currentBlog.content)}</span>
                    </motion.div>
                </div>
            </header>

            {/* Hero Image with Parallax */}
            <div className="blog-post__hero-image-wrapper">
                <motion.div
                    className="blog-post__hero-image-container"
                    style={{ y: imageY, scale: imageScale }}
                >
                    <img
                        src={heroImageUrl}
                        alt={currentBlog.title}
                        className="blog-post__hero-image"
                        onError={(e) => {
                            e.target.src = getFallbackImage(currentBlog.id);
                        }}
                    />
                </motion.div>
            </div>

            {/* Article Content */}
            <article className="blog-post__content">
                <motion.div
                    className="blog-post__body"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    {/* First paragraph with drop cap */}
                    <DropCapText content={currentBlog.content} />

                    {/* Additional content paragraphs - simulating rich article content */}
                    <p>
                        The art of floral arrangement has been cherished across cultures for millennia.
                        From the elaborate ikebana traditions of Japan to the romantic garden styles of
                        English country estates, flowers have always held a special place in human expression.
                    </p>

                    <blockquote className="blog-post__quote">
                        "Every flower is a soul blossoming in nature. Each petal tells a story of
                        patience, growth, and the simple beauty of life."
                    </blockquote>

                    <p>
                        At Floralia, we believe that every bouquet should tell a story. Our master florists
                        carefully select each bloom, considering not just color and form, but the subtle
                        language that flowers speak. A carefully chosen arrangement can convey emotions
                        that words sometimes cannot.
                    </p>

                    <h2>The Philosophy of Luxury Floristry</h2>

                    <p>
                        What sets artisanal floristry apart is the attention to detail and the understanding
                        that creating beauty is both an art and a science. Temperature, humidity, cutting
                        techniques, and timing all play crucial roles in ensuring that each arrangement
                        reaches you at the peak of its beauty.
                    </p>

                    <p>
                        Our commitment to sustainability means we work closely with local growers and
                        seasonal availability, ensuring that our bouquets not only look stunning but also
                        respect the natural rhythms of the earth. This philosophy extends to our packaging,
                        which is crafted from recycled and biodegradable materials.
                    </p>

                    <h2>Creating Memorable Moments</h2>

                    <p>
                        Whether you're celebrating a milestone, expressing sympathy, or simply bringing
                        beauty into everyday life, the right flowers can transform a moment into a memory.
                        We invite you to explore our collections and discover the perfect expression for
                        your next occasion.
                    </p>
                </motion.div>
            </article>

            {/* Divider */}
            <div className="blog-post__divider">
                <svg width="60" height="12" viewBox="0 0 60 12" fill="none">
                    <circle cx="6" cy="6" r="3" fill="#2C3E2E" opacity="0.3" />
                    <circle cx="30" cy="6" r="4" fill="#2C3E2E" opacity="0.5" />
                    <circle cx="54" cy="6" r="3" fill="#2C3E2E" opacity="0.3" />
                </svg>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="blog-post__related">
                    <h2 className="blog-post__related-title">You Might Also Like</h2>
                    <div className="blog-post__related-grid">
                        {relatedPosts.map((blog) => (
                            <RelatedBlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>
                </section>
            )}

            {/* Back to Blog Link */}
            <div className="blog-post__back">
                <Link to="/blog" className="blog-post__back-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to all articles
                </Link>
            </div>
        </motion.main>
    );
};

export default BlogPost;
