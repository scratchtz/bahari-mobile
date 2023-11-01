import intl from 'react-intl-universal';
import {encryptedStorage} from '@storage/mmkv';
import {useMMKVString} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {useEffect, useRef} from 'react';
import type {SupportedLanguage} from '@constants/languages';

//For loading translations, use only on app start in Navigation.tsx
export default function useTranslationInit() {
    const [appLanguage, setAppLanguage] = useMMKVString(StorageKeys.language, encryptedStorage) as [
        SupportedLanguage | undefined,
        (language: SupportedLanguage) => void,
    ];
    if (!appLanguage) {
        setAppLanguage('en');
    }

    useEffect(() => {
        if (!appLanguage) {
            reloadLanguage('en');
            return;
        }
        reloadLanguage(appLanguage);
    }, [appLanguage]);

    return {
        appLanguage,
        setAppLanguage,
    };
}

const reloadLanguage = (language: SupportedLanguage) => {
    void intl.init({
        fallbackLocale: 'en',
        currentLocale: language,

        locales: {
            en: require('../translations/en.json'),
            ko: require('../translations/ko.json'),
            sw: require('../translations/sw.json'),
        },
    });
};
