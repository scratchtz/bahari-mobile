import {rounded, spacing} from './constants';
import {palette} from './palette';
import {DisplayTheme} from '@utils/types';
import {StyleSheet} from 'react-native';

export type FontWeight = '300' | '400' | '500' | '600' | '700' | '800';
export type FontColors = 'primary' | 'secondary' | 'tertiary';

export const PASSWORD_STRENGTH_COLORS = {
    0: palette.rose500,
    1: palette.rose500,
    2: palette.amber500,
    3: palette.teal500,
};

const COLORS_LIGHT = {
    primary: palette.violet600,
    // primary: palette.neutral900,
    secondaryLight: palette.teal500,
    secondary: palette.teal600,

    mainBackground: '#F8FAFC',
    stackHeaderBackground: palette.gray50,
    tabBackground: palette.gray100,
    tabActiveTint: palette.black,
    tabInactiveTint: palette.gray400,

    textPrimary: palette.gray900,
    textSecondary: palette.gray500,
    textTertiary: palette.gray400,

    highlight: palette.neutral200,

    cardBackground: palette.white,
    cardBackgroundLight: palette.gray200,
    border: palette.gray200,
    borderLight: palette.gray100,

    white: palette.white,
    black: palette.black,

    success: palette.teal500,
    shadow: palette.gray300,

    modalBackground: palette.gray50,
    modalIndicator: palette.gray300,

    tag: palette.white,
    warning: palette.rose500,

    priceUp: palette.sky500,
    priceDown: '#F6475D',

    actionButton: 'white',
};

export const lightTheme = {
    scheme: 'light' as DisplayTheme,
    isDark: false,
    colors: COLORS_LIGHT,
    cardVariants: {
        simple: {
            backgroundColor: COLORS_LIGHT.cardBackground,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: COLORS_LIGHT.border,
            shadowColor: COLORS_LIGHT.shadow,
            shadowOffset: {
                height: 0,
                width: 3,
            },
            shadowRadius: 19,
            shadowOpacity: 0.5,
            elevation: 5,
        },
    },
    tag: {
        borderRadius: rounded.full,
        backgroundColor: COLORS_LIGHT.tag,
        borderWidth: 0.5,
        borderColor: COLORS_LIGHT.border,
        shadowColor: COLORS_LIGHT.shadow,
        shadowOffset: {
            height: 4,
            width: 0,
        },
        shadowRadius: 4,
        shadowOpacity: 0.2,
        elevation: 2,
    },
    buttonVariants: {
        primary: {
            backgroundColor: COLORS_LIGHT.primary,
            padding: spacing.l,
            borderRadius: rounded.xl,
            alignItems: 'center',
            shadowColor: COLORS_LIGHT.shadow,
            shadowOffset: {
                height: 0,
                width: 5,
            },
            shadowRadius: 12,
            shadowOpacity: 0.5,
        },
        secondary: {
            backgroundColor: 'transparent',
            borderColor: COLORS_LIGHT.textSecondary,
            borderWidth: 1,
            padding: spacing.l,
            borderRadius: rounded.xl,
            alignItems: 'center',
        },
        disabled: {
            backgroundColor: palette.gray200,
            padding: spacing.l,
            borderRadius: rounded.l,
            alignItems: 'center',
        },
    },
    buttonTextVariants: {
        primary: {
            color: palette.white,
        },
        secondary: {
            color: COLORS_LIGHT.textPrimary,
        },
        disabled: {
            color: palette.gray400,
        },
    },
    textVariants: {
        header: {
            fontSize: 30,
            color: COLORS_LIGHT.textPrimary,
            fontFamily: 'OpenSans-700',
        },
        subheader: {
            fontSize: 16,
            color: COLORS_LIGHT.textSecondary,
            fontFamily: 'OpenSans-700',
        },
        body: {
            fontSize: 14,
            color: palette.gray900,
            fontFamily: 'OpenSans-400',
        },
        sub: {
            fontSize: 14,
            color: palette.gray700,
            fontFamily: 'OpenSans-400',
        },
        small: {
            fontSize: 13,
            color: palette.gray500,
            fontFamily: 'OpenSans-400',
        },
        tiny: {
            fontSize: 12,
            color: palette.gray500,
            fontFamily: 'OpenSans-400',
        },
        nav: {
            fontSize: 14,
            color: palette.gray900,
            fontFamily: 'OpenSans-600',
        },
    },
};

export type AppTheme = typeof lightTheme;

type AppColors = typeof COLORS_LIGHT;

const COLORS_DARK: AppColors = {
    primary: COLORS_LIGHT.primary,
    secondary: COLORS_LIGHT.secondary,
    secondaryLight: COLORS_LIGHT.secondaryLight,

    mainBackground: palette.dark900,
    stackHeaderBackground: palette.dark900,
    tabBackground: palette.dark900,
    tabActiveTint: palette.white,
    tabInactiveTint: palette.gray600,

    textPrimary: palette.gray100,
    textSecondary: palette.gray400,
    textTertiary: palette.gray600,

    highlight: palette.dark500,

    cardBackground: palette.dark700,
    cardBackgroundLight: palette.dark400,

    border: '#283344',
    borderLight: '#252e3f',

    white: palette.white,
    black: palette.black,

    success: palette.teal500,
    shadow: 'transparent',

    modalBackground: palette.dark900,
    modalIndicator: palette.dark500,

    tag: palette.dark700,
    warning: palette.rose400,

    priceUp: palette.sky400,
    priceDown: '#F6475D',

    actionButton: palette.gray800,
};

export const darkTheme: AppTheme = {
    ...lightTheme,
    scheme: 'dark',
    isDark: true,
    colors: COLORS_DARK,
    cardVariants: {
        simple: {
            ...lightTheme.cardVariants.simple,
            backgroundColor: COLORS_DARK.cardBackground,
            borderColor: COLORS_DARK.border,
            shadowColor: COLORS_DARK.shadow,
            shadowOffset: {
                height: 0,
                width: 0,
            },
            shadowRadius: 0,
            shadowOpacity: 0,
            elevation: 0,
        },
    },
    tag: {
        borderRadius: rounded.full,
        backgroundColor: COLORS_DARK.tag,
        borderWidth: 0.5,
        borderColor: COLORS_DARK.border,
        shadowColor: COLORS_DARK.shadow,
        shadowOffset: {
            height: 0,
            width: 0,
        },
        shadowRadius: 0,
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonVariants: {
        primary: {
            ...lightTheme.buttonVariants.primary,
            backgroundColor: COLORS_DARK.primary,
            shadowOpacity: 0,
        },
        secondary: {
            ...lightTheme.buttonVariants.secondary,
            backgroundColor: 'transparent',
            borderColor: COLORS_DARK.textSecondary,
            borderWidth: 1,
        },
        disabled: {
            ...lightTheme.buttonVariants.disabled,
            backgroundColor: palette.dark800,
        },
    },
    buttonTextVariants: {
        primary: {
            color: palette.white,
        },
        secondary: {
            color: palette.white,
        },
        disabled: {
            color: palette.dark400,
        },
    },
    textVariants: {
        header: {
            ...lightTheme.textVariants.header,
            color: palette.gray50,
        },
        subheader: {
            ...lightTheme.textVariants.subheader,
            color: palette.gray100,
        },
        body: {
            ...lightTheme.textVariants.body,
            color: palette.gray100,
        },
        sub: {
            ...lightTheme.textVariants.sub,
            color: palette.gray300,
        },
        small: {
            ...lightTheme.textVariants.small,
            color: palette.gray300,
        },
        tiny: {
            ...lightTheme.textVariants.tiny,
            color: palette.gray300,
        },
        nav: {
            ...lightTheme.textVariants.nav,
            color: palette.gray100,
        },
    },
};

const COLORS_DARK_ZERO: AppColors = {
    primary: COLORS_LIGHT.primary,
    secondary: COLORS_LIGHT.secondary,
    secondaryLight: COLORS_LIGHT.secondaryLight,

    mainBackground: '#000000',
    stackHeaderBackground: '#000000',
    tabBackground: '#000000',
    tabActiveTint: palette.white,
    tabInactiveTint: palette.gray600,

    textPrimary: palette.gray100,
    textSecondary: palette.gray400,
    textTertiary: palette.gray600,

    highlight: palette.neutral900,

    cardBackground: '#0F0F0F',
    cardBackgroundLight: '#222222',

    border: '#252525',
    borderLight: '#333333',

    white: palette.white,
    black: palette.black,

    success: palette.teal500,
    shadow: 'transparent',

    modalBackground: '#0C0C0C',
    modalIndicator: '#333333',

    tag: '#151515',
    warning: palette.rose400,

    priceUp: palette.sky400,
    priceDown: '#F6475D',

    actionButton: '#191919',
};
export const darkZeroTheme: AppTheme = {
    ...lightTheme,
    scheme: 'dark-zero',
    isDark: true,
    colors: COLORS_DARK_ZERO,
    cardVariants: {
        simple: {
            ...lightTheme.cardVariants.simple,
            backgroundColor: COLORS_DARK_ZERO.cardBackground,
            borderColor: COLORS_DARK_ZERO.border,
            shadowColor: COLORS_DARK_ZERO.shadow,
            shadowOffset: {
                height: 0,
                width: 0,
            },
            shadowRadius: 0,
            shadowOpacity: 0,
            elevation: 0,
        },
    },
    tag: {
        borderRadius: rounded.full,
        backgroundColor: COLORS_DARK_ZERO.tag,
        borderWidth: 0.5,
        borderColor: COLORS_DARK_ZERO.border,
        shadowColor: COLORS_DARK_ZERO.shadow,
        shadowOffset: {
            height: 0,
            width: 0,
        },
        shadowRadius: 0,
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonVariants: {
        primary: {
            ...lightTheme.buttonVariants.primary,
            backgroundColor: COLORS_DARK_ZERO.primary,
            shadowOpacity: 0,
        },
        secondary: {
            ...lightTheme.buttonVariants.secondary,
            backgroundColor: 'transparent',
            borderColor: COLORS_DARK_ZERO.textSecondary,
            borderWidth: 1,
        },
        disabled: {
            ...lightTheme.buttonVariants.disabled,
            backgroundColor: '#111111',
        },
    },
    buttonTextVariants: {
        primary: {
            color: palette.white,
        },
        secondary: {
            color: palette.white,
        },
        disabled: {
            color: '#777777',
        },
    },
    textVariants: {
        header: {
            ...lightTheme.textVariants.header,
            color: palette.gray50,
        },
        subheader: {
            ...lightTheme.textVariants.subheader,
            color: palette.gray100,
        },
        body: {
            ...lightTheme.textVariants.body,
            color: palette.gray100,
        },
        sub: {
            ...lightTheme.textVariants.sub,
            color: palette.gray300,
        },
        small: {
            ...lightTheme.textVariants.small,
            color: palette.gray300,
        },
        tiny: {
            ...lightTheme.textVariants.tiny,
            color: palette.gray300,
        },
        nav: {
            ...lightTheme.textVariants.nav,
            color: palette.gray100,
        },
    },
};
