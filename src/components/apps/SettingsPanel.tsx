import { useTranslation } from 'react-i18next'
import type { AppProps } from '@/types'

export function SettingsPanel({ onClose: _onClose, item }: AppProps) {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('language', lng)
  }

  if (item?.id === 'settings-about') {
    return (
      <div className="h-full overflow-y-auto px-6 py-6 max-w-md font-mono text-sm leading-relaxed text-[var(--text-primary)]">
        <h2 className="text-lg font-display font-medium text-[var(--text-primary)] mb-6">
          About
        </h2>
        <p className="whitespace-pre-wrap">
          Interfaces dictate how we move through the digital world. Modern software has largely abandoned that responsibility in favor of administrative bloat.{"\n\n"}
          This operating system is a functional study in structural minimalism, built as a direct homage to Yasuhiro Yamanaka's interface design philosophy. When Yamanaka engineered Sony's XrossMediaBar, he solved a complex information architecture problem through radical distillation. By intersecting two independent axes and anchoring the focal point to the center of the screen, he eliminated the cognitive friction of scanning a grid. Navigation became instinct. The interface disappeared.{"\n\n"}
          ingaOS is a personal love letter to the legend who defined the interfaces of my childhood.
        </p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-6 max-w-md">
      <h2 className="text-lg font-display font-medium text-[var(--text-primary)] mb-6">
        {t('settings.title')}
      </h2>

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
                i18n.language.startsWith(code)
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
