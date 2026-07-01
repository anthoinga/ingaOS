export function registerSwipeNavigation({
  isActive,
  moveCategory,
  moveItem,
}: {
  isActive: () => boolean
  moveCategory: (dir: -1 | 1) => void
  moveItem: (dir: -1 | 1) => void
}) {
  let start: { x: number; y: number } | null = null

  const handleTouchStart = (e: TouchEvent) => {
    if (!isActive()) return
    if (e.touches.length > 0) {
      start = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
    }
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isActive()) return
    if (!start) return
    if (e.changedTouches.length === 0) return

    const touch = e.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    start = null

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
}
