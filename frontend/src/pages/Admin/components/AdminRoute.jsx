import React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
    const user = useSelector((state) => state.user);
    const location = useLocation();

    if (user.loading) {
        return null; // Or a loading spinner
    }

    if (!user.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
