import {AppTheme} from '@utils/styles';
import {StyleSheet} from 'react-native';

export const markdownStyles = (theme: AppTheme) =>
    StyleSheet.create({
        body: {
            color: theme.colors.textPrimary,
            fontSize: 16,
        },
        heading1: {
            color: theme.colors.textPrimary,
            fontSize: 26,
            marginTop: 12,
            fontWeight: 'bold',
        },
        heading2: {
            fontSize: 24,
            marginTop: 12,
            fontWeight: 'bold',
        },
        heading3: {
            fontSize: 20,
            fontWeight: 'bold',
        },
        link: {
            color: theme.colors.textPrimary,
        },
        hr: {
            backgroundColor: theme.colors.border,
            height: 1,
        },
    });
