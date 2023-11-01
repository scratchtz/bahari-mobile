import {useCallback, useMemo} from 'react';
import {ColorSchemeName, useColorScheme} from 'react-native';
import {useMMKVString} from 'react-native-mmkv';
import {DisplayTheme} from '@utils/types';
import {StorageKeys} from '../constants/storage';

//useAppColorScheme returns "light" or "dark" or "dark-zero" depending on the user's settings.
export function useAppColorScheme() {
    const systemColor = useColorScheme() as NonNullable<ColorSchemeName>;
    const [currentTheme] = useMMKVString(StorageKeys.theme);
    const current = currentTheme || 'system';
    return useMemo(() => (current === 'system' ? systemColor : current), [systemColor, currentTheme]);
}

export function useAppColorSettings() {
    const [currentTheme] = useMMKVString(StorageKeys.theme);
    if (currentTheme) {
        return currentTheme as DisplayTheme;
    }
    return 'system';
}

export function useAppColorSchemeChanger() {
    const [appTheme, setAppTheme] = useMMKVString('app-theme');
    const setTheme = useCallback((theme: DisplayTheme) => {
        return setAppTheme(theme);
    }, []);

    return {colorScheme: appTheme as DisplayTheme, setColorScheme: setTheme};
}
