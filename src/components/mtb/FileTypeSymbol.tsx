import { cn } from '@/lib/utils'
import { resolveItemMeta } from './itemMeta'
import type { MTBItem } from '@/types'

interface Props {
  item: MTBItem
  className?: string
}

export function FileTypeSymbol({ item, className }: Props) {
  const { icon: Icon, extension, colorClass } = resolveItemMeta(item)

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-lg border shrink-0 select-none transition-all duration-200',
        colorClass,
        className
      )}
    >
      <Icon className="w-4 h-4 sm:w-5 h-5" />
      <span className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 text-[6px] sm:text-[8px] font-bold font-mono tracking-wider opacity-80 uppercase">
        {extension}
      </span>
    </div>
  )
}
