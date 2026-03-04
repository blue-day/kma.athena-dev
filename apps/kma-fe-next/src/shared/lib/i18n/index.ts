import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ko from './locales/ko.json';
import en from './locales/en.json';

i18n
  .use(LanguageDetector) // 브라우저 언어 감지 (저장된 설정 유지)
  .use(initReactI18next)
  .init({
    resources: {
      ko: { translation: ko },
      en: { translation: en },
    },
    fallbackLng: 'ko', // 기본 언어
    interpolation: {
      escapeValue: false, // React는 XSS 안전하므로 false
    },
  });

export default i18n;
