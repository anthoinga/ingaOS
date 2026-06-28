import { useState, useEffect } from 'react'
import { useXMBNavigation } from '@/hooks/useXMBNavigation'
import { CATEGORIES } from '@/data/categories'
import { playSound } from '@/lib/soundEngine'
import { CategoryRail } from './CategoryRail'
import { ItemList } from './ItemList'
import { WaveBackground } from './WaveBackground'
import { AppMount } from './AppMount'
import type { CategoryKey } from '@/types'

interface Props {
  onExit: () => void
}

function Clock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="text-xs text-[var(--text-muted)] font-mono tabular-nums">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  )
}

export function XMBShell({ onExit: _onExit }: Props) {
  const { state, moveCategory, moveItem, openApp, closeApp } = useXMBNavigation()

  const activeCategory = CATEGORIES[state.activeCategoryIndex]

  const handleSelectItem = (index: number) => {
    const diff = index - state.activeItemIndex
    if (diff !== 0) moveItem(diff > 0 ? 1 : -1)
  }

  const handleOpenItem = (index: number) => {
    const item = activeCategory?.items[index]
    if (!item) return
    const action = item.action
    if (action.type === 'openApp') {
      playSound('select_confirm')
      openApp(action.app as CategoryKey)
    } else if (action.type === 'openUrl') {
      window.open(action.url, '_blank', 'noopener')
    }
  }

  const handleSelectCategory = (index: number) => {
    const diff = index - state.activeCategoryIndex
    if (diff !== 0) moveCategory(diff > 0 ? 1 : -1)
  }

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      <WaveBackground />

      <div className="flex justify-end px-6 pt-3 pb-1 shrink-0">
        <Clock />
      </div>

      <div className="flex-1" />

      <div className="shrink-0 pb-6">
        <CategoryRail
          categories={CATEGORIES}
          activeCategoryIndex={state.activeCategoryIndex}
          onSelectCategory={handleSelectCategory}
          onOpenApp={(key) => {
            playSound('select_confirm')
            openApp(key)
          }}
        />

        {activeCategory && activeCategory.items.length > 0 && (
          <div className="mt-3 px-2">
            <ItemList
              category={activeCategory}
              activeItemIndex={state.activeItemIndex}
              onSelectItem={handleSelectItem}
              onOpenItem={handleOpenItem}
            />
          </div>
        )}
      </div>

      <AppMount openApp={state.openApp} onClose={closeApp} />
    </div>
  )
}
