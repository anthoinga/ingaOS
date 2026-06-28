import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'

interface Props {
  onOpen: () => void
}

export function LandingPage({ onOpen }: Props) {
  const { t } = useTranslation()

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(160deg, var(--bg-raised) 0%, var(--bg-surface) 40%, var(--bg-primary) 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <motion.div
        className="text-center"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
      >
        <h1 className="text-5xl font-display font-semibold text-[var(--text-primary)] mb-3 tracking-tight">
          {t('landing.name')}
        </h1>
        <p className="text-base text-[var(--text-muted)] mb-10 tracking-wide">
          {t('landing.tagline')}
        </p>
        <button
          onClick={onOpen}
          className="px-8 py-3 rounded-full border border-[var(--accent)] text-[var(--accent)] text-sm font-medium tracking-widest uppercase hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] transition-all duration-200"
        >
          {t('landing.cta')}
        </button>
      </motion.div>

      {/* Decorative XMB-style dots */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 flex justify-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.6 }}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <span
            key={i}
            className="w-1 h-1 rounded-full"
            style={{ background: i === 4 ? 'var(--accent)' : 'var(--text-muted)' }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}
