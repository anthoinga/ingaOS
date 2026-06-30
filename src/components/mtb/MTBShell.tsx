import { cn } from '@/lib/utils'
import { useMTBNavigation } from '@/hooks/useMTBNavigation'
import { CATEGORIES } from '@/data/categories'
import { playSound } from '@/effects/soundEngine'
import { CategoryColumn } from './CategoryColumn'
import { ItemList } from './ItemList'
import { WaveBackground, CRIMSON } from '@/effects/WaveBackground'
import { resolveItemMeta } from './itemMeta'
import { ContentPanel } from './ContentPanel'
import { CornerUpLeft } from 'lucide-react'
import { StatusBar } from './StatusBar'
import { useMusic } from '@/contexts/MusicContext'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation'
import { motion } from 'motion/react'


interface Props {
  isActive?: boolean
  onExit: () => void
}

export function MTBShell({ onExit, isActive = true }: Props) {
  const isMobile = useIsMobile()
  const { state, moveCategory, moveItem, openApp, closeApp } = useMTBNavigation(isActive, onExit)
  useSwipeNavigation({ isActive, moveCategory, moveItem })
  const { play } = useMusic()

  const activeCategory = CATEGORIES[state.activeCategoryIndex]
  const activeItem = activeCategory?.items[state.activeItemIndex]
  const targetColors = activeItem ? resolveItemMeta(activeItem).palette : CRIMSON

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

      <div className="absolute top-0 left-0 right-0 sm:top-8 sm:left-auto sm:right-10 z-20 px-4 py-3 sm:px-0 sm:py-0">
        <StatusBar />
      </div>

      <div className="relative z-10 w-full h-full pt-[20vh] sm:pt-[25vh]">
        <div className="relative z-10 overflow-hidden w-full h-[120px] sm:h-[180px]">
          <CategoryColumn
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
          <motion.div
            layout
            className={cn(
              "absolute top-0 bottom-0 overflow-hidden pointer-events-none z-0",
              isMobile ? "left-[5vw] w-[90vw]" : "left-[calc(22vw-56px)] w-[640px]"
            )}
          >
            <div className={cn("pointer-events-auto h-full", isMobile ? "pt-[calc(20vh+110px)]" : "pt-[calc(25vh+170px)]")}>
              <ItemList
                key={activeCategory.key}
                category={activeCategory}
                activeItemIndex={state.activeItemIndex}
                onSelectItem={handleSelectItem}
                onOpenItem={handleOpenItem}
              />
            </div>
          </motion.div>
        )}
      </div>

      <ContentPanel openApp={state.openApp} activeItem={activeItem ?? null} onClose={closeApp} />

      {/* Bottom-left back exit button (styled to match FileTypeSymbol) */}
      <button
        onClick={onExit}
        className={cn(
          "absolute bottom-4 left-4 sm:bottom-10 sm:left-12 z-50 flex flex-col items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-lg border shrink-0 select-none cursor-pointer focus:outline-none transition-all duration-200 pointer-events-auto",
          "text-neutral-400 bg-neutral-500/10 border-neutral-500/25"
        )}
        aria-label="Exit back to landing page"
      >
        <CornerUpLeft className="w-4 h-4 sm:w-5 h-5" />
        <span className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 text-[6px] sm:text-[8px] font-bold font-mono tracking-wider opacity-80 uppercase">
          ESC
        </span>
      </button>
    </div>
  )
}
