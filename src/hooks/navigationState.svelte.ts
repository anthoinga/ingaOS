import type { CategoryKey } from '@/types'
import { CATEGORIES } from '@/data/categories'
import { playSound } from '@/effects/soundEngine'
import { musicState } from './musicState.svelte'

export class NavigationState {
  activeCategoryIndex = $state(0)
  activeItemIndex = $state(0)
  openApp = $state<CategoryKey | null>(null)
  transitioning = $state(false)

  // Derived properties
  get activeCategory() {
    return CATEGORIES[this.activeCategoryIndex]
  }

  get activeItem() {
    return this.activeCategory?.items?.[this.activeItemIndex] || null
  }

  moveCategory(dir: -1 | 1) {
    const next = this.activeCategoryIndex + dir
    if (next < 0 || next >= CATEGORIES.length) return
    playSound('tick_horizontal')
    this.activeCategoryIndex = next
    this.activeItemIndex = 0
  }

  moveItem(dir: -1 | 1) {
    const items = this.activeCategory?.items ?? []
    if (items.length === 0) return
    const next = this.activeItemIndex + dir
    if (next < 0 || next >= items.length) return
    playSound('tick_vertical')
    this.activeItemIndex = next
  }

  open(app: CategoryKey) {
    playSound('launch_whoosh')
    this.openApp = app
    this.transitioning = true
  }

  close() {
    playSound('close_swoosh')
    this.openApp = null
    this.transitioning = true
  }

  resetItemIndex() {
    this.activeItemIndex = 0
  }

  setTransitioning(val: boolean) {
    this.transitioning = val
  }

  confirmSelect() {
    const cat = this.activeCategory
    if (!cat) return
    const items = cat.items
    if (items.length === 0) {
      playSound('select_confirm')
      this.open(cat.key)
      return
    }
    const item = items[this.activeItemIndex]
    if (!item) return
    const action = item.action
    if (!action) {
      playSound('tick_horizontal')
      return
    }
    if (action.type === 'openApp') {
      playSound('select_confirm')
      this.open(action.app)
    } else if (action.type === 'openUrl') {
      playSound('select_confirm')
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
}
