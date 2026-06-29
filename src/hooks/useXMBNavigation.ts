import { useReducer, useCallback, useEffect } from 'react'
import type { XMBState, CategoryKey } from '@/types'
import { CATEGORIES } from '@/data/categories'
import { playSound } from '@/effects/soundEngine'
import { useMusic } from '@/contexts/MusicContext'

type Action =
  | { type: 'MOVE_CATEGORY'; direction: -1 | 1 }
  | { type: 'MOVE_ITEM'; direction: -1 | 1 }
  | { type: 'OPEN_APP'; app: CategoryKey }
  | { type: 'CLOSE_APP' }
  | { type: 'SET_TRANSITIONING'; value: boolean }
  | { type: 'RESET_ITEM_INDEX' }

function reducer(state: XMBState, action: Action): XMBState {
  switch (action.type) {
    case 'MOVE_CATEGORY': {
      const next = state.activeCategoryIndex + action.direction
      if (next < 0 || next >= CATEGORIES.length) return state
      return { ...state, activeCategoryIndex: next, activeItemIndex: 0 }
    }
    case 'MOVE_ITEM': {
      const items = CATEGORIES[state.activeCategoryIndex]?.items ?? []
      if (items.length === 0) return state
      const next = state.activeItemIndex + action.direction
      if (next < 0 || next >= items.length) return state
      return { ...state, activeItemIndex: next }
    }
    case 'OPEN_APP':
      return { ...state, openApp: action.app, transitioning: true }
    case 'CLOSE_APP':
      return { ...state, openApp: null, transitioning: true }
    case 'SET_TRANSITIONING':
      return { ...state, transitioning: action.value }
    case 'RESET_ITEM_INDEX':
      return { ...state, activeItemIndex: 0 }
    default:
      return state
  }
}

const INITIAL: XMBState = {
  activeCategoryIndex: 0,
  activeItemIndex: 0,
  openApp: null,
  transitioning: false,
}

export function useXMBNavigation(isActive: boolean = true, onExit?: () => void) {
  const [state, dispatch] = useReducer(reducer, INITIAL)
  const { play } = useMusic()

  const moveCategory = useCallback((dir: -1 | 1) => {
    playSound('tick_horizontal')
    dispatch({ type: 'MOVE_CATEGORY', direction: dir })
  }, [])

  const moveItem = useCallback((dir: -1 | 1) => {
    playSound('tick_vertical')
    dispatch({ type: 'MOVE_ITEM', direction: dir })
  }, [])

  const openApp = useCallback((app: CategoryKey) => {
    playSound('launch_whoosh')
    dispatch({ type: 'OPEN_APP', app })
  }, [])

  const closeApp = useCallback(() => {
    playSound('close_swoosh')
    dispatch({ type: 'CLOSE_APP' })
  }, [])

  const confirmSelect = useCallback(() => {
    const cat = CATEGORIES[state.activeCategoryIndex]
    if (!cat) return
    const items = cat.items
    if (items.length === 0) {
      // dynamic category — open the app directly
      playSound('select_confirm')
      openApp(cat.key)
      return
    }
    const item = items[state.activeItemIndex]
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
      playSound('select_confirm')
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
  }, [state.activeCategoryIndex, state.activeItemIndex, openApp, play])

  const doneTransitioning = useCallback(() => {
    dispatch({ type: 'SET_TRANSITIONING', value: false })
  }, [])

  useEffect(() => {
    if (!isActive) return

    const onKey = (e: KeyboardEvent) => {
      if (state.openApp) {
        if (e.key === 'Escape') closeApp()
        return
      }
      if (e.key === 'Escape') {
        if (state.activeItemIndex > 0) {
          playSound('close_swoosh')
          dispatch({ type: 'RESET_ITEM_INDEX' })
        } else if (onExit) {
          playSound('close_swoosh')
          onExit()
        }
        return
      }
      switch (e.key) {
        case 'ArrowLeft':  moveCategory(-1); break
        case 'ArrowRight': moveCategory(1);  break
        case 'ArrowUp':    moveItem(-1);     break
        case 'ArrowDown':  moveItem(1);      break
        case 'Enter':      confirmSelect();  break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isActive, state.openApp, state.activeItemIndex, moveCategory, moveItem, confirmSelect, closeApp, onExit])

  return { state, moveCategory, moveItem, openApp, closeApp, confirmSelect, doneTransitioning }
}
