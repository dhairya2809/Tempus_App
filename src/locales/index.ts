import {I18n} from 'i18n-js';
import en from './en/en.json';
import fr from './fr/fr.json';
import pt from './pt/pt.json';
import es from './es/es.json';

const i18n = new I18n();

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en: en, //en definintion here,
  fr: fr,
  pt: pt,
  es: es,
};
// Set the locale once at the beginning of your app.
i18n.locale = 'en';

export const localiseString = (key: string) => {
  return i18n.t(key);
};

export const setAppLocale = (locale: string) => {
  i18n.locale = locale;
};

export const getCurrentLocale = () => {
  return i18n.defaultLocale;
};

export default i18n;
