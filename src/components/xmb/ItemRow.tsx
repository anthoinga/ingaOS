import { cn } from '@/lib/utils'
import type { XMBItem } from '@/types'

interface Props {
  item: XMBItem
  isActive: boolean
  onClick: () => void
}

export function ItemRow({ item, isActive, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-4 px-5 py-3 rounded-lg text-left transition-all duration-150',
        'focus:outline-none select-none',
        isActive
          ? 'bg-[var(--bg-raised)] text-[var(--text-primary)]'
          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]',
      )}
    >
      {item.thumbnail && (
        <img
          src={item.thumbnail}
          alt=""
          className="w-10 h-10 rounded object-cover shrink-0"
        />
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium font-sans truncate">{item.label}</p>
        {item.subtitle && (
          <p className="text-xs text-[var(--text-muted)] truncate">{item.subtitle}</p>
        )}
      </div>
      {isActive && (
        <span className="ml-auto text-[var(--accent)] text-xs">▶</span>
      )}
    </button>
  )
}
