import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  onClose: () => void
}

type Theme = 'dark' | 'light'

export function SettingsPanel({ onClose: _onClose }: Props) {
  const { t, i18n } = useTranslation()
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme | null) ?? 'dark',
  )

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
    if (theme === 'light') {
      document.documentElement.style.setProperty('--bg-primary',   '#F5F2EE')
      document.documentElement.style.setProperty('--bg-surface',   '#EBE7E1')
      document.documentElement.style.setProperty('--bg-raised',    '#D6D0C8')
      document.documentElement.style.setProperty('--text-primary', '#1C1A17')
      document.documentElement.style.setProperty('--text-muted',   '#8A8278')
    } else {
      document.documentElement.style.setProperty('--bg-primary',   '#131210')
      document.documentElement.style.setProperty('--bg-surface',   '#1c1a17')
      document.documentElement.style.setProperty('--bg-raised',    '#3E3A32')
      document.documentElement.style.setProperty('--text-primary', '#DFD9D0')
      document.documentElement.style.setProperty('--text-muted',   '#56534D')
    }
  }, [theme])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('language', lng)
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-6 max-w-md">
      <h2 className="text-lg font-display font-semibold text-[var(--text-primary)] mb-6">
        {t('settings.title')}
      </h2>

      <section className="mb-6">
        <h3 className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3">
          {t('settings.theme')}
        </h3>
        <div className="flex gap-2">
          {(['dark', 'light'] as const).map((t_) => (
            <button
              key={t_}
              onClick={() => setTheme(t_)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                theme === t_
                  ? 'bg-[var(--accent)] text-[var(--bg-primary)]'
                  : 'bg-[var(--bg-raised)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {t_ === 'dark' ? t('settings.theme_dark') : t('settings.theme_light')}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3">
          {t('settings.language')}
        </h3>
        <div className="flex gap-2">
          {[
            { code: 'en', label: t('settings.lang_en') },
            { code: 'es', label: t('settings.lang_es') },
          ].map(({ code, label }) => (
            <button
              key={code}
              onClick={() => changeLanguage(code)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                i18n.language === code
                  ? 'bg-[var(--accent)] text-[var(--bg-primary)]'
                  : 'bg-[var(--bg-raised)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
