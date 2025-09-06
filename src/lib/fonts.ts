
export const Fonts = {

    thin: 'Metropolis-Thin',
    thinItalic: 'Metropolis-ThinItalic',

    extraLight: 'Metropolis-ExtraLight',
    extraLightItalic: 'Metropolis-ExtraLightItalic',

    light: 'Metropolis-Light',
    lightItalic: 'Metropolis-LightItalic',

    regular: 'Metropolis-Regular',
    regularItalic: 'Metropolis-RegularItalic',

    medium: 'Metropolis-Medium',
    mediumItalic: 'Metropolis-MediumItalic',

    semiBold: 'Metropolis-SemiBold',
    semiBoldItalic: 'Metropolis-SemiBoldItalic',


    bold: 'Metropolis-Bold',
    boldItalic: 'Metropolis-BoldItalic',


    extraBold: 'Metropolis-ExtraBold',
    extraBoldItalic: 'Metropolis-ExtraBoldItalic',


    black: 'Metropolis-Black',
    blackItalic: 'Metropolis-BlackItalic',
} as const;


export const FontStyles = {

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
