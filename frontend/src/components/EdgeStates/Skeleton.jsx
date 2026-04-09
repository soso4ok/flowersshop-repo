import React from 'react';
import './EdgeStates.scss';

/**
 * Base Skeleton component with pulsing/shimmer animation
 * Used as a building block for more complex skeleton layouts
 */
export const Skeleton = ({
    width = '100%',
    height = '20px',
    borderRadius,
    className = '',
    style = {}
}) => {
    return (
        <div
            className={`skeleton ${className}`}
            style={{
                width,
                height,
                borderRadius,
                ...style
            }}
        />
    );
};
