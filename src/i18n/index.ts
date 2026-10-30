import { createI18n } from 'vue-i18n'
import en from './en.json'
import es from './es.json'
import fr from './fr.json'
import de from './de.json'
import it from './it.json'
import pt from './pt.json'

type MessageSchema = typeof en

export const supportedLocales = ['en', 'es', 'fr', 'de', 'it', 'pt'] as const
export type SupportedLocale = (typeof supportedLocales)[number]

const STORAGE_KEY_UI_LANG = 'app-ui-language'

const getStoredLocale = (): SupportedLocale | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_UI_LANG)
    if (saved && supportedLocales.includes(saved as SupportedLocale)) {
      return saved as SupportedLocale
    }
  } catch {
    // fallback if localStorage is not accessible
  }
  return null
}

const browserLocale = (typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en') as SupportedLocale
const initialLocale = getStoredLocale() || (supportedLocales.includes(browserLocale) ? browserLocale : 'en')

const i18n = createI18n<[MessageSchema], SupportedLocale, false>({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    es,
    fr,
    de,
    it,
    pt
  }
})

export const getUiLanguage = (): SupportedLocale => i18n.global.locale.value || initialLocale

export const setUiLanguage = (locale: SupportedLocale): void => {
  if (supportedLocales.includes(locale)) {
    i18n.global.locale.value = locale
    try {
      localStorage.setItem(STORAGE_KEY_UI_LANG, locale)
    } catch {
      // ignore
    }
  }
}

export default i18n
