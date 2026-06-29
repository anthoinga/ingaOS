import { useEffect, useRef } from 'react'

export function useSwipeNavigation({
  isActive,
  moveCategory,
  moveItem,
}: {
  isActive: boolean
  moveCategory: (dir: -1 | 1) => void
  moveItem: (dir: -1 | 1) => void
}): void {
  const startRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!isActive) return

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        startRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        }
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startRef.current) return
      if (e.changedTouches.length === 0) return

      const touch = e.changedTouches[0]
      const dx = touch.clientX - startRef.current.x
      const dy = touch.clientY - startRef.current.y
      startRef.current = null

      const absX = Math.abs(dx)
      const absY = Math.abs(dy)
      const threshold = 30

      if (Math.max(absX, absY) < threshold) return

      if (absX > absY) {
        if (dx > 0) {
          moveCategory(-1)
        } else {
          moveCategory(1)
        }
      } else {
        if (dy < 0) {
          moveItem(1)
        } else {
          moveItem(-1)
        }
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isActive, moveCategory, moveItem])
}
