import React from 'react';
import './Button.scss';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    type = 'button',
    onClick,
    ...props
}) => {
    const baseClass = 'floral-btn';
    const variantClass = `${baseClass}--${variant}`;
    const sizeClass = `${baseClass}--${size}`;

    return (
        <button
            type={type}
            className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
