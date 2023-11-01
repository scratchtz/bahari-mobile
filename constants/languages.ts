//use iso code standard + label
export type SupportedLanguage = 'en' | 'ko' | 'sw';

const SupportedLanguages: {[key in SupportedLanguage]: string} = {
    en: 'English',
    ko: '한국어',
    sw: 'Kiswahili',
} as const;

export default SupportedLanguages;
