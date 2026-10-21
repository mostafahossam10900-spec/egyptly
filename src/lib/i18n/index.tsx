import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ar } from './ar'
import { en, type MessageKey, type Messages } from './en'

/**
 * Locale registry. Only locales with `complete: true` can be selected. Phase 4 locales are listed so
 * the architecture is ready, but they are shown as unavailable — never as complete translations.
 */
export const LOCALES = [
  { code: 'en', label: 'English', dir: 'ltr', complete: true },
  { code: 'ar', label: 'العربية', dir: 'rtl', complete: true },
  { code: 'it', label: 'Italiano', dir: 'ltr', complete: false },
  { code: 'es', label: 'Español', dir: 'ltr', complete: false },
  { code: 'de', label: 'Deutsch', dir: 'ltr', complete: false },
  { code: 'ru', label: 'Русский', dir: 'ltr', complete: false },
  { code: 'uk', label: 'Українська', dir: 'ltr', complete: false },
  { code: 'tr', label: 'Türkçe', dir: 'ltr', complete: false },
] as const

export type LocaleCode = (typeof LOCALES)[number]['code']
export type ActiveLocale = 'en' | 'ar'

export const CATALOGS: Record<ActiveLocale, Messages> = { en, ar }

const STORAGE_KEY = 'egyptly.locale'

function readStoredLocale(): ActiveLocale {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'en' || v === 'ar') return v
  } catch {
    // storage unavailable — fall through
  }
  return typeof navigator !== 'undefined' && navigator.language?.startsWith('ar') ? 'ar' : 'en'
}

export function format(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`))
}

interface I18nValue {
  locale: ActiveLocale
  dir: 'ltr' | 'rtl'
  setLocale: (l: ActiveLocale) => void
  t: (key: MessageKey, vars?: Record<string, string | number>) => string
  /** Pick the Arabic or English field of a bilingual record. */
  pick: (r: { name_ar: string; name_en: string }) => string
  formatDate: (iso: string) => string
  formatNumber: (n: number, opts?: Intl.NumberFormatOptions) => string
  formatMoney: (n: number, currency: string) => string
  /** "A, B and C" / "أ وب وج" */
  formatList: (items: string[]) => string
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children, initial }: { children: ReactNode; initial?: ActiveLocale }) {
  const [locale, setLocaleState] = useState<ActiveLocale>(initial ?? readStoredLocale)
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [locale, dir])

  const setLocale = useCallback((l: ActiveLocale) => {
    setLocaleState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      // ignore
    }
  }, [])

  const value = useMemo<I18nValue>(() => {
    const cat = CATALOGS[locale]
    // Arabic UI uses Arabic-Indic digits only where Intl decides; we keep Latin digits ("ar-EG-u-nu-latn")
    // so dates, numbers and amounts stay unambiguous for tourists.
    const intlLocale = locale === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB'
    return {
      locale,
      dir,
      setLocale,
      t: (key, vars) => format(cat[key] ?? en[key], vars),
      pick: (r) => (locale === 'ar' ? r.name_ar : r.name_en),
      formatDate: (iso) => {
        const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
        const d = m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : new Date(iso)
        return new Intl.DateTimeFormat(intlLocale, { dateStyle: 'medium', timeZone: m ? 'UTC' : undefined }).format(d)
      },
      formatNumber: (n, opts) => new Intl.NumberFormat(intlLocale, opts).format(n),
      formatMoney: (n, currency) =>
        new Intl.NumberFormat(intlLocale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(n),
      formatList: (items) => new Intl.ListFormat(intlLocale, { style: 'long', type: 'conjunction' }).format(items),
    }
  }, [locale, dir, setLocale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nValue {
  const v = useContext(I18nContext)
  if (!v) throw new Error('useI18n must be used inside I18nProvider')
  return v
}
