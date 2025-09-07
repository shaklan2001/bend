import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  const baseClasses = 'rounded-full font-semibold items-center justify-center';

  const variantClasses = {
    primary: 'bg-blue-600 active:bg-blue-700',
    secondary: 'bg-gray-600 active:bg-gray-700',
    outline: 'bg-transparent border-2 border-blue-600',
  };

  const sizeClasses = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  };

  const textClasses = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-blue-600',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <Text
        className={
          textClassName || `${textClasses[variant]} ${textSizeClasses[size]} font-semibold`
        }
      >
        {title || children}
      </Text>
    </TouchableOpacity>
  );
}

interface GradientButtonProps extends TouchableOpacityProps {
  title: string;
  colors?: string[];
  size?: 'sm' | 'md' | 'lg';
}

export const GradientButton = React.memo(
  ({ title, colors = ['#3B82F6', '#1D4ED8'], size = 'md', ...props }: GradientButtonProps) => {
    const sizeClasses = {
      sm: 'px-4 py-2',
      md: 'px-6 py-3',
      lg: 'px-8 py-4',
    };

    const textSizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    return (
      <TouchableOpacity
        style={{
          borderRadius: 50,
          overflow: 'hidden',
        }}
        activeOpacity={0.7}
        {...props}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 12,
          }}
        />
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: size === 'lg' ? 18 : size === 'md' ? 16 : 14,
            fontWeight: '700',
            textAlign: 'center',
            paddingVertical: size === 'lg' ? 16 : size === 'md' ? 12 : 8,
            paddingHorizontal: size === 'lg' ? 32 : size === 'md' ? 24 : 16,
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
);

interface ShareButtonProps extends TouchableOpacityProps {
  title: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  size?: 'sm' | 'md' | 'lg';
}

export const ShareButton = React.memo(
  ({ title, icon = 'share-variant', size = 'md', ...props }: ShareButtonProps) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: '#FFFFFF',
          borderWidth: 2,
          borderColor: '#E5E7EB',
          borderRadius: 50,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        activeOpacity={0.7}
        {...props}
      >
        <MaterialCommunityIcons
          name={icon}
          size={size === 'lg' ? 24 : size === 'md' ? 20 : 16}
          color='#6B7280'
        />
        <Text
          style={{
            color: '#6B7280',
            fontWeight: '600',
            fontSize: size === 'lg' ? 18 : size === 'md' ? 16 : 14,
            paddingVertical: size === 'lg' ? 16 : size === 'md' ? 12 : 8,
            paddingHorizontal: 6,
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
);
