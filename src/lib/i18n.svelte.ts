import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from '../locales/en.json'
import es from '../locales/es.json'

// Svelte 5 reactive state for current language triggers updates
let _lang = $state(localStorage.getItem('language') || 'en')

i18next
  .use(LanguageDetector)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })
  .then(() => {
    _lang = i18next.language
  })

// Reactive translation helper
export function t(key: string, options?: Record<string, unknown>) {
  return i18next.t(key, { lng: _lang, ...options })
}

// Function to change language reactively
export function changeLanguage(lng: string) {
  i18next.changeLanguage(lng).then(() => {
    _lang = lng
    localStorage.setItem('language', lng)
  })
}

export function getLanguage() {
  return _lang
}

export const i18n = i18next
