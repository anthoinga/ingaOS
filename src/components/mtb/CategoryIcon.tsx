import { useTranslation } from 'react-i18next'
import {
  Settings,
  Briefcase,
  Hammer,
  Globe,
  Image,
  Music2,
  FileText,
  User,
  Gamepad2,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

const ICON_MAP: Record<string, LucideIcon> = {
  settings: Settings,
  work: Briefcase,
  built: Hammer,
  browser: Globe,
  photos: Image,
  music: Music2,
  files: FileText,
  contacts: User,
  games: Gamepad2,
}

interface Props {
  category: Category
  isActive: boolean
  onClick: () => void
}

export function CategoryIcon({ category, isActive, onClick }: Props) {
  const { t } = useTranslation()
  const IconComponent = ICON_MAP[category.key] || Globe

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-3 px-2 py-2 sm:px-4 sm:py-3 rounded-lg transition-all duration-200 select-none focus:outline-none',
        isActive
          ? 'scale-110'
          : 'scale-[0.9] text-neutral-500',
      )}
      aria-label={t(category.labelKey)}
    >
      <IconComponent
        className={cn(
          'w-12 h-12 sm:w-20 sm:h-20 transition-all duration-200',
          isActive
            ? 'text-white drop-shadow-[0_0_8px_var(--accent)]'
            : 'text-current',
        )}
        strokeWidth={1.75}
        fill="none"
      />
      {isActive && (
        <span className="text-sm sm:text-base font-medium tracking-wide font-sans text-white">
          {t(category.labelKey)}
        </span>
      )}
    </button>
  )
}
