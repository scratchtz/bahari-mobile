import {AppTheme} from '@utils/styles';
import {useMemo} from 'react';
import {useAppTheme} from './useAppTheme';

type Generator<T extends {}> = (theme: AppTheme) => T;

//useThemeStyleSheet - used to create stylesheet that changes based on the selected theme
export const useThemeStyleSheet = <T extends {}>(fn: Generator<T>) => {
    const theme = useAppTheme();
    return useMemo(() => fn(theme), [theme]);
};

//useThemeStyleSheetProvided - just like useThemeStyleSheet exept you provide the theme
export const useThemeStyleSheetProvided = <T extends {}>(theme: AppTheme, fn: Generator<T>) => {
    return useMemo(() => fn(theme), [theme]);
};
