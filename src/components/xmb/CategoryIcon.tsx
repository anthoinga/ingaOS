import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

interface Props {
  category: Category
  isActive: boolean
  onClick: () => void
}

export function CategoryIcon({ category, isActive, onClick }: Props) {
  const { t } = useTranslation()

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 select-none',
        'focus:outline-none',
        isActive
          ? 'scale-125 opacity-100'
          : 'scale-100 opacity-50 hover:opacity-75',
      )}
      aria-label={t(category.labelKey)}
    >
      <span className="text-3xl leading-none" role="img" aria-hidden>
        {category.icon}
      </span>
      <span
        className={cn(
          'text-xs font-medium tracking-wide transition-colors duration-200 font-sans',
          isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]',
        )}
      >
        {t(category.labelKey)}
      </span>
      {isActive && (
        <span className="block w-1 h-1 rounded-full bg-[var(--accent)]" />
      )}
    </button>
  )
}
