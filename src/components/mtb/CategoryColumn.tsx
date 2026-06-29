import { useRef, useEffect } from 'react'
import { CategoryIcon } from './CategoryIcon'
import type { Category, CategoryKey } from '@/types'
import { useIsMobile } from '@/hooks/useIsMobile'

interface Props {
  categories: Category[]
  activeCategoryIndex: number
  onSelectCategory: (index: number) => void
  onOpenApp: (key: CategoryKey) => void
}

export function CategoryColumn({
  categories,
  activeCategoryIndex,
  onSelectCategory,
  onOpenApp,
}: Props) {
  const columnRef = useRef<HTMLDivElement>(null)
  const iconRefs = useRef<Array<HTMLDivElement | null>>([])
  const isMobile = useIsMobile()
  const activeColumnRatio = isMobile ? 0.5 : 0.22

  // Slide the column so the active icon sits at the rest ratio from the left edge — MTB pan behaviour
  useEffect(() => {
    const column = columnRef.current
    const activeEl = iconRefs.current[activeCategoryIndex]
    if (!column || !activeEl) return
    const targetX = window.innerWidth * activeColumnRatio
    const iconMid = activeEl.offsetLeft + activeEl.offsetWidth / 2
    column.style.transform = `translateX(${targetX - iconMid}px)`
  }, [activeCategoryIndex, activeColumnRatio])

  return (
    <div
      ref={columnRef}
      className="flex items-center gap-2 px-8 w-max"
      style={{ transition: 'transform 300ms ease' }}
      role="tablist"
      aria-label="Categories"
    >
      {categories.map((cat, i) => (
        <div
          key={cat.key}
          ref={el => { iconRefs.current[i] = el }}
        >
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
