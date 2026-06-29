import { useEffect } from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform, animate, type MotionValue } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { ItemRow } from './ItemRow'
import type { Category, XMBItem } from '@/types'

const ROW_PITCH = 96 // px between item centers; scrollY tracks -activeItemIndex * ROW_PITCH
const FALLOFF = 180 // px from the selection line where scale/opacity bottom out

interface Props {
  category: Category
  activeItemIndex: number
  onSelectItem: (index: number) => void
  onOpenItem: (index: number) => void
}

interface ItemWrapperProps {
  item: XMBItem
  index: number
  activeItemIndex: number
  scrollY: MotionValue<number>
  onSelectItem: (index: number) => void
  onOpenItem: (index: number) => void
}

function PlaylistItemWrapper({
  item,
  index,
  activeItemIndex,
  scrollY,
  onSelectItem,
  onOpenItem,
}: ItemWrapperProps) {
  // Distance from the center of the fixed selection rail.
  const scale = useTransform(scrollY, (y) => {
    const dy = index * ROW_PITCH + y
    const absDy = Math.abs(dy)
    if (absDy >= FALLOFF) return 0.8
    const t = absDy / FALLOFF
    const factor = 1 - t * t // smooth ease-out quadratic
    return 0.8 + factor * 0.2 // scales from 0.8 to 1.0
  })

  const opacity = useTransform(scrollY, (y) => {
    const dy = index * ROW_PITCH + y
    if (dy < 0) {
      // Items scrolling up past the selection line: steep falloff to 0 to prevent overlap
      const absDy = Math.abs(dy)
      if (absDy >= ROW_PITCH) return 0
      const t = absDy / ROW_PITCH
      return 1 - t * t // fades to 0 one step up
    } else {
      // Items scrolling down below the selection line: standard falloff to 0.4
      const absDy = Math.abs(dy)
      if (absDy >= FALLOFF) return 0.4
      const t = absDy / FALLOFF
      const factor = 1 - t * t
      return 0.4 + factor * 0.6
    }
  })

  const subOpacity = useTransform(scrollY, (y) => {
    const dy = index * ROW_PITCH + y
    const absDy = Math.abs(dy)
    if (absDy >= FALLOFF) return 0
    const t = absDy / FALLOFF
    const factor = 1 - t * t
    return factor * factor // steeper falloff for subtitles
  })

  return (
    <motion.div
      style={{
        opacity,
        scale,
      }}
      className="w-full shrink-0 origin-left"
    >
      <ItemRow
        item={item}
        isActive={index === activeItemIndex}
        subOpacity={subOpacity}
        onClick={() => {
          if (index === activeItemIndex) {
            onOpenItem(index)
          } else {
            onSelectItem(index)
          }
        }}
      />
    </motion.div>
  )
}

export function ItemList({ category, activeItemIndex, onSelectItem, onOpenItem }: Props) {
  const { t } = useTranslation()
  const scrollY = useMotionValue(-activeItemIndex * ROW_PITCH)

  useEffect(() => {
    animate(scrollY, -activeItemIndex * ROW_PITCH, {
      duration: 0.3,
      ease: [0.25, 1, 0.5, 1],
    })
  }, [activeItemIndex, scrollY])

  if (category.items.length === 0) {
    return (
      <div className="px-8 py-4">
        <p className="text-sm text-[var(--text-muted)]">{t('apps.loading')}</p>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={category.key}
        role="listbox"
        className="w-full flex flex-col gap-1"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
        style={{ y: scrollY }}
      >
        {category.items.map((item, i) => (
          <PlaylistItemWrapper
            key={item.id}
            item={item}
            index={i}
            activeItemIndex={activeItemIndex}
            scrollY={scrollY}
            onSelectItem={onSelectItem}
            onOpenItem={onOpenItem}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
