import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from "i18next";
import enUsTrans from "../locales/en-us.json";
import zhHantTrans from "../locales/zh-Hant.json";
import zhHansTrans from "../locales/zh-Hans.json";
import { initReactI18next } from 'react-i18next';

// detect the language of the browser
// init i18next.
i18n.use(LanguageDetector).use(initReactI18next).init({
  // import resource files
  resources: {
    en: {
      translation: enUsTrans,
    },
    zhHant: {
      translation: zhHantTrans,
    },
    zhHans: {
      translation: zhHansTrans,
    },
  },
  // set default language
  fallbackLng: "en",
  debug: false,
  interpolation: {
    // not needed for react as it escapes by default
    escapeValue: false,
  },
});

export { i18n };
