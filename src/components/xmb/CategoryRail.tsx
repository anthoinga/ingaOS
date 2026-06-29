import { useRef, useEffect } from 'react'
import { CategoryIcon } from './CategoryIcon'
import type { Category, CategoryKey } from '@/types'

const ACTIVE_RAIL_RATIO = 0.22 // active icon rests this fraction in from the left edge (XMB pan)

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
  const iconRefs = useRef<Array<HTMLDivElement | null>>([])

  // Slide the rail so the active icon sits at the rest ratio from the left edge — XMB pan behaviour
  useEffect(() => {
    const rail = railRef.current
    const activeEl = iconRefs.current[activeCategoryIndex]
    if (!rail || !activeEl) return
    const targetX = window.innerWidth * ACTIVE_RAIL_RATIO
    const iconMid = activeEl.offsetLeft + activeEl.offsetWidth / 2
    rail.style.transform = `translateX(${targetX - iconMid}px)`
  }, [activeCategoryIndex])

  return (
    <div
      ref={railRef}
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
