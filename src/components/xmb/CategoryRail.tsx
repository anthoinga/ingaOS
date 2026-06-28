import { useRef, useEffect } from 'react'
import { CategoryIcon } from './CategoryIcon'
import type { Category, CategoryKey } from '@/types'

interface Props {
  categories: Category[]
  activeCategoryIndex: number
  onSelectCategory: (index: number) => void
  onOpenApp: (key: CategoryKey) => void
}

export function CategoryRail({
  categories,
  activeCategoryIndex,
  onSelectCategory,
  onOpenApp,
}: Props) {
  const railRef = useRef<HTMLDivElement>(null)

  // keep active icon centred in the rail on mobile
  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    const active = rail.children[activeCategoryIndex] as HTMLElement | undefined
    if (!active) return
    active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activeCategoryIndex])

  return (
    <div
      ref={railRef}
      className="flex items-end gap-2 px-8 overflow-x-auto scrollbar-none"
      style={{ scrollSnapType: 'x mandatory' }}
      role="tablist"
      aria-label="Categories"
    >
      {categories.map((cat, i) => (
        <div key={cat.key} style={{ scrollSnapAlign: 'center' }}>
          <CategoryIcon
            category={cat}
            isActive={i === activeCategoryIndex}
            onClick={() => {
              if (i === activeCategoryIndex) {
                onOpenApp(cat.key)
              } else {
                onSelectCategory(i)
              }
            }}
          />
        </div>
      ))}
    </div>
  )
}
