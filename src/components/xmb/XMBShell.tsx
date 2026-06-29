import { cn } from '@/lib/utils'
import { useXMBNavigation } from '@/hooks/useXMBNavigation'
import { CATEGORIES } from '@/data/categories'
import { playSound } from '@/effects/soundEngine'
import { CategoryRail } from './CategoryRail'
import { ItemList } from './ItemList'
import { WaveBackground, CRIMSON } from '@/effects/WaveBackground'
import { itemIdentity } from './itemIdentity'
import { AppMount } from './AppMount'
import { CornerUpLeft } from 'lucide-react'
import { StatusBar } from './StatusBar'
import { useMusic } from '@/contexts/MusicContext'


interface Props {
  isActive?: boolean
  onExit: () => void
}

export function XMBShell({ onExit, isActive = true }: Props) {
  const { state, moveCategory, moveItem, openApp, closeApp } = useXMBNavigation(isActive, onExit)
  const { play } = useMusic()

  const activeCategory = CATEGORIES[state.activeCategoryIndex]
  const activeItem = activeCategory?.items[state.activeItemIndex]
  const targetColors = activeItem ? itemIdentity(activeItem).palette : CRIMSON

  const handleSelectItem = (index: number) => {
    const diff = index - state.activeItemIndex
    if (diff !== 0) moveItem(diff > 0 ? 1 : -1)
  }

  const handleOpenItem = (index: number) => {
    const item = activeCategory?.items[index]
    if (!item) return
    const action = item.action
    if (!action) {
      playSound('tick_horizontal')
      return
    }
    if (action.type === 'openApp') {
      playSound('select_confirm')
      openApp(action.app)
    } else if (action.type === 'openUrl') {
      window.open(action.url, '_blank', 'noopener')
    } else if (action.type === 'playTrack') {
      playSound('select_confirm')
      play({
        id: action.trackId,
        title: action.title,
        artist: action.artist,
        src: action.src,
        cover: action.cover,
      })
    }
  }

  const handleSelectCategory = (index: number) => {
    const diff = index - state.activeCategoryIndex
    if (diff !== 0) moveCategory(diff > 0 ? 1 : -1)
  }

  return (
    <div className="relative z-0 w-full h-full overflow-hidden select-none">
      <WaveBackground targetColors={targetColors} />

      <div className="absolute top-8 right-10 z-10">
        <StatusBar />
      </div>

      <div className="relative w-full h-full pt-[25vh]">
        <div className="relative z-10 overflow-hidden w-full h-[180px]">
          <CategoryRail
            categories={CATEGORIES}
            activeCategoryIndex={state.activeCategoryIndex}
            onSelectCategory={handleSelectCategory}
            onOpenApp={(key) => {
              playSound('select_confirm')
              openApp(key)
            }}
          />
        </div>

        {activeCategory && activeCategory.items.length > 0 && (
          <div className="absolute left-[calc(22vw-56px)] top-0 bottom-0 w-[640px] overflow-hidden pointer-events-none z-0">
            <div className="pointer-events-auto h-full pt-[calc(25vh+170px)]">
              <ItemList
                key={activeCategory.key}
                category={activeCategory}
                activeItemIndex={state.activeItemIndex}
                onSelectItem={handleSelectItem}
                onOpenItem={handleOpenItem}
              />
            </div>
          </div>
        )}
      </div>

      <AppMount openApp={state.openApp} activeItem={activeItem ?? null} onClose={closeApp} />

      {/* Bottom-left back exit button (styled to match FileTypeSymbol) */}
      <button
        onClick={onExit}
        className={cn(
          "absolute bottom-10 left-12 z-50 flex flex-col items-center justify-center w-12 h-12 rounded-lg border shrink-0 select-none cursor-pointer focus:outline-none transition-all duration-200 pointer-events-auto",
          "text-neutral-400 bg-neutral-500/10 border-neutral-500/25"
        )}
        aria-label="Exit back to landing page"
      >
        <CornerUpLeft className="w-5 h-5" />
        <span className="absolute bottom-1 right-1 text-[8px] font-bold font-mono tracking-wider opacity-80 uppercase">
          ESC
        </span>
      </button>
    </div>
  )
}
