<script lang="ts">

  import { cn } from '@/lib/utils'
  import { NavigationState } from '@/hooks/navigationState.svelte'
  import { CATEGORIES } from '@/data/categories'
  import { playSound } from '@/effects/soundEngine'
  import CategoryColumn from './CategoryColumn.svelte'
  import ItemList from './ItemList.svelte'
  import WaveBackground from '@/effects/WaveBackground.svelte'
  import { CRIMSON } from '@/effects/waveColors'
  import { resolveItemMeta } from './itemMeta'
  import ContentPanel from './ContentPanel.svelte'
  import { CornerUpLeft } from 'lucide-svelte'
  import StatusBar from './StatusBar.svelte'
  import { isMobile } from '@/hooks/isMobile.svelte'
  import { registerSwipeNavigation } from '@/hooks/swipeNavigation'
  import { musicState } from '@/hooks/musicState.svelte'

  interface Props {
    isActive?: boolean
    onExit: () => void
  }

  let { onExit, isActive = true }: Props = $props()

  // Instantiate Svelte 5 reactive navigation state
  const nav = new NavigationState()

  const activeCategory = $derived(CATEGORIES[nav.activeCategoryIndex])
  const activeItem = $derived(activeCategory?.items[nav.activeItemIndex] ?? null)
  const targetColors = $derived(activeItem ? resolveItemMeta(activeItem).palette : CRIMSON)

  function handleSelectItem(index: number) {
    const diff = index - nav.activeItemIndex
    if (diff !== 0) nav.moveItem(diff > 0 ? 1 : -1)
  }

  function handleOpenItem(index: number) {
    const item = activeCategory?.items[index]
    if (!item) return
    const action = item.action
    if (!action) {
      playSound('tick_horizontal')
      return
    }
    if (action.type === 'openApp') {
      playSound('select_confirm')
      nav.open(action.app)
    } else if (action.type === 'openUrl') {
      window.open(action.url, '_blank', 'noopener')
    } else if (action.type === 'playTrack') {
      playSound('select_confirm')
      musicState.play({
        id: action.trackId,
        title: action.title,
        artist: action.artist,
        src: action.src,
        cover: action.cover,
      })
    }
  }

  function handleSelectCategory(index: number) {
    const diff = index - nav.activeCategoryIndex
    if (diff !== 0) nav.moveCategory(diff > 0 ? 1 : -1)
  }

  // Keyboard and Swipe Gestures Registration
  $effect(() => {
    const unregisterSwipe = registerSwipeNavigation({
      isActive: () => isActive,
      moveCategory: (dir) => nav.moveCategory(dir),
      moveItem: (dir) => nav.moveItem(dir),
    })

    const onKey = (e: KeyboardEvent) => {
      if (!isActive) return

      if (nav.openApp) {
        if (e.key === 'Escape') nav.close()
        return
      }

      if (e.key === 'Escape') {
        if (nav.activeItemIndex > 0) {
          playSound('close_swoosh')
          nav.resetItemIndex()
        } else if (onExit) {
          playSound('close_swoosh')
          onExit()
        }
        return
      }

      switch (e.key) {
        case 'ArrowLeft':  e.preventDefault(); nav.moveCategory(-1); break
        case 'ArrowRight': e.preventDefault(); nav.moveCategory(1);  break
        case 'ArrowUp':    e.preventDefault(); nav.moveItem(-1);     break
        case 'ArrowDown':  e.preventDefault(); nav.moveItem(1);      break
        case 'Enter':      e.preventDefault(); nav.confirmSelect();  break
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      unregisterSwipe()
    }
  })
</script>

<div class="relative z-0 w-full h-full overflow-hidden select-none">
  <WaveBackground {targetColors} />

  <div class="absolute top-0 left-0 right-0 sm:top-8 sm:left-auto sm:right-10 z-20 px-4 py-3 sm:px-0 sm:py-0">
    <StatusBar />
  </div>

  <div class="relative z-10 w-full h-full pt-[20vh] sm:pt-[25vh] overflow-hidden">
    <div class="relative z-10 overflow-hidden w-full h-[120px] sm:h-[180px]">
      <CategoryColumn
        categories={CATEGORIES}
        activeCategoryIndex={nav.activeCategoryIndex}
        onSelectCategory={handleSelectCategory}
        onOpenApp={(key) => {
          playSound('select_confirm')
          nav.open(key)
        }}
      />
    </div>

    {#if activeCategory && activeCategory.items.length > 0}
      <div
        class={cn(
          "absolute top-0 bottom-0 overflow-hidden pointer-events-none z-0",
          isMobile() ? "left-[5vw] w-[90vw]" : "left-[calc(22vw-56px)] w-[640px]"
        )}
      >
        <div class={cn("pointer-events-auto h-full grid grid-cols-1 grid-rows-1", isMobile() ? "pt-[calc(20vh+110px)]" : "pt-[calc(25vh+170px)]")}>
          {#key activeCategory.key}
            <ItemList
              category={activeCategory}
              activeItemIndex={nav.activeItemIndex}
              onSelectItem={handleSelectItem}
              onOpenItem={handleOpenItem}
            />
          {/key}
        </div>
      </div>
    {/if}
  </div>

  <ContentPanel openApp={nav.openApp} activeItem={activeItem} onClose={() => nav.close()} />

  <!-- Bottom-left back exit button (styled to match FileTypeSymbol) -->
  <button
    onclick={onExit}
    class={cn(
      "absolute bottom-4 left-4 sm:bottom-10 sm:left-12 z-50 flex flex-col items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-lg border shrink-0 select-none cursor-pointer focus:outline-none transition-all duration-200 pointer-events-auto",
      "text-neutral-400 bg-neutral-500/10 border-neutral-500/25"
    )}
    aria-label="Exit back to landing page"
  >
    <CornerUpLeft class="w-4 h-4 sm:w-5 h-5" />
    <span class="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 text-[6px] sm:text-[8px] font-bold font-mono tracking-wider opacity-80 uppercase">
      ESC
    </span>
  </button>
</div>
