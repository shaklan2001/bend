// Font configuration for the BendApp
export const Fonts = {
    // Thin weights
    thin: 'Metropolis-Thin',
    thinItalic: 'Metropolis-ThinItalic',

    // Extra Light weights
    extraLight: 'Metropolis-ExtraLight',
    extraLightItalic: 'Metropolis-ExtraLightItalic',

    // Light weights
    light: 'Metropolis-Light',
    lightItalic: 'Metropolis-LightItalic',

    // Regular weights
    regular: 'Metropolis-Regular',
    regularItalic: 'Metropolis-RegularItalic',

    // Medium weights
    medium: 'Metropolis-Medium',
    mediumItalic: 'Metropolis-MediumItalic',

    // Semi Bold weights
    semiBold: 'Metropolis-SemiBold',
    semiBoldItalic: 'Metropolis-SemiBoldItalic',

    // Bold weights
    bold: 'Metropolis-Bold',
    boldItalic: 'Metropolis-BoldItalic',

    // Extra Bold weights
    extraBold: 'Metropolis-ExtraBold',
    extraBoldItalic: 'Metropolis-ExtraBoldItalic',

    // Black weights
    black: 'Metropolis-Black',
    blackItalic: 'Metropolis-BlackItalic',
} as const;

// Common font combinations for different use cases
export const FontStyles = {
    // Headings
    heading1: {
        fontFamily: Fonts.bold,
        fontWeight: '600',
        fontSize: 28,
        lineHeight: 36,
    },
    heading2: {
        fontFamily: Fonts.bold,
        fontSize: 24,
        lineHeight: 32,
    },
    heading3: {
        fontFamily: Fonts.semiBold,
        fontSize: 20,
        lineHeight: 28,
    },

    // Body text
    bodyLarge: {
        fontFamily: Fonts.regular,
        fontSize: 18,
        lineHeight: 26,
    },
    bodyMedium: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        lineHeight: 24,
    },
    bodySmall: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        lineHeight: 20,
    },
    bodyXSmall: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        lineHeight: 18,
    },

    // Buttons and interactive elements
    button: {
        fontFamily: Fonts.semiBold,
        fontSize: 16,
        lineHeight: 24,
    },
    buttonLarge: {
        fontFamily: Fonts.semiBold,
        fontSize: 18,
        lineHeight: 26,
    },

    // Special text
    logo: {
        fontFamily: Fonts.bold,
        fontSize: 64,
        lineHeight: 72,
    },
    caption: {
        fontFamily: Fonts.medium,
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 20,
    },
} as const;
