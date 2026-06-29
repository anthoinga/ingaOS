import { cn } from '@/lib/utils'
import { itemIdentity } from './itemIdentity'
import type { XMBItem } from '@/types'

interface Props {
  item: XMBItem
  className?: string
}

export function FileTypeSymbol({ item, className }: Props) {
  const { icon: Icon, extension, colorClass } = itemIdentity(item)

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center w-12 h-12 rounded-lg border shrink-0 select-none transition-all duration-200',
        colorClass,
        className
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="absolute bottom-1 right-1 text-[8px] font-bold font-mono tracking-wider opacity-80 uppercase">
        {extension}
      </span>
    </div>
  )
}
