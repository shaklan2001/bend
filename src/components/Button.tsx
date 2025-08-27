import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    children?: React.ReactNode;
    title?: string;
    textClassName?: string;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    children,
    title,
    textClassName,
    className = '',
    ...props
}: ButtonProps) {
    const baseClasses = 'rounded-xl font-semibold items-center justify-center';

    const variantClasses = {
        primary: 'bg-blue-600 active:bg-blue-700',
        secondary: 'bg-gray-600 active:bg-gray-700',
        outline: 'bg-transparent border-2 border-blue-600'
    };

    const sizeClasses = {
        sm: 'px-4 py-2',
        md: 'px-6 py-3',
        lg: 'px-8 py-4'
    };

    const textClasses = {
        primary: 'text-white',
        secondary: 'text-white',
        outline: 'text-blue-600'
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };

    return (
        <TouchableOpacity
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            <Text className={textClassName || `${textClasses[variant]} ${textSizeClasses[size]} font-semibold`}>
                {title || children}
            </Text>
        </TouchableOpacity>
    );
}
