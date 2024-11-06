import {useMMKVString} from 'react-native-mmkv';
import {StorageKeys} from '@constants/storage';
import {encryptedStorage} from '@storage/mmkv';
import {useEffect} from 'react';
import i18next from 'i18next';

export default function useTranslationInit() {
    const [appLanguage, setAppLanguage] = useMMKVString(StorageKeys.language, encryptedStorage)
    if (!appLanguage) {
        setAppLanguage('en');
        return;
    }

    useEffect(() => {
        if (!appLanguage) {
            setAppLanguage('en')
            return;
        }
        void i18next.changeLanguage(appLanguage);
    }, [appLanguage]);

    return {
        appLanguage,
        setAppLanguage,
    };
}