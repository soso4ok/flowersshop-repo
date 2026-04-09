import React, { useEffect } from "react";
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Ensures that on every route change, the page scrolls to the top.
 * This prevents users from landing in the middle of a new page.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Instant scroll to top on route change
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
