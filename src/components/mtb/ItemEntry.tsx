import { useTranslation } from 'react-i18next'
import { motion, type MotionValue } from 'motion/react'
import { cn } from '@/lib/utils'
import { FileTypeSymbol } from './FileTypeSymbol'
import type { MTBItem } from '@/types'

interface Props {
  item: MTBItem
  isActive: boolean
  onClick: () => void
  subOpacity?: MotionValue<number>
}

export function ItemEntry({ item, isActive, onClick, subOpacity }: Props) {
  const { t } = useTranslation()

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 sm:gap-6 sm:px-8 h-[72px] sm:h-[92px] rounded-3xl text-left transition-colors duration-100 shrink-0',
        'focus:outline-none select-none',
        isActive
          ? 'glass-active text-[var(--text-primary)]'
          : 'text-[var(--text-muted)]',
      )}
    >
      <FileTypeSymbol item={item} />
      {item.thumbnail && (
        <img
          src={item.thumbnail}
          alt=""
          className="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover shrink-0"
        />
      )}
      <div className="min-w-0">
        <p 
          className={cn("font-medium font-sans truncate", isActive && "active-text-glow")}
          style={{ fontSize: 'var(--text-ui-base)' }}
        >
          {item.labelKey ? t(item.labelKey) : item.label}
        </p>
        {item.subtitle && (
          <motion.p
            style={subOpacity ? { opacity: subOpacity, fontSize: 'var(--text-ui-sm)' } : { fontSize: 'var(--text-ui-sm)' }}
            className="text-[var(--text-muted)] truncate"
          >
            {item.subtitle}
          </motion.p>
        )}
      </div>
      <motion.span
        style={subOpacity ? { opacity: isActive ? subOpacity : 0 } : undefined}
        animate={isActive ? { x: [0, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={cn(
          'ml-auto text-white text-xs sm:text-base',
          isActive ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        ▶
      </motion.span>
    </button>
  )
}
