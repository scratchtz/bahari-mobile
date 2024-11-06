//use iso code standard + label
export type SupportedLanguage = 'en' | 'es' | 'ja' | 'ko' | 'ru' | 'zh';

const SupportedLanguages: {[key in SupportedLanguage]: string} = {
    en: 'English',
    ko: '한국어',
    es: 'español',
    ja:'日本語',
    ru:'русский',
    zh:'中文'
} as const;

export default SupportedLanguages;