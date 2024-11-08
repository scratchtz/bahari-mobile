import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './translations/en.json';
import ko from './translations/ko.json';
import zh from './translations/zh.json';
import ru from './translations/ru.json';
import ja from './translations/ja.json';
import es from './translations/es.json';

const resources = {
    en: {translation: en},
    ko: {translation: ko},
    zh: {translation: zh},
    ru: {translation: ru},
    ja: {translation: ja},
    es: {translation: es},
};

i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'en',
    interpolation: {escapeValue: false},
});

export default i18n;
