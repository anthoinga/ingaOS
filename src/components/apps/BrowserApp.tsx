import { useState } from 'react'
import bookmarks from '@/data/bookmarks.json'

interface Props { onClose: () => void }

export function BrowserApp({ onClose: _onClose }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const selected = bookmarks.find((b) => b.id === active)

  return (
    <div className="h-full flex flex-col">
      {/* Bookmark bar */}
      <div className="flex gap-2 px-4 py-2 border-b border-[var(--bg-raised)] overflow-x-auto shrink-0">
        {bookmarks.map((b) => (
          <button
            key={b.id}
            onClick={() => setActive(b.id)}
            className={`text-xs px-3 py-1 rounded whitespace-nowrap transition-colors ${
              active === b.id
                ? 'bg-[var(--accent)] text-[var(--bg-primary)]'
                : 'bg-[var(--bg-raised)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* Iframe */}
      <div className="flex-1 relative">
        {selected ? (
          <iframe
            src={selected.url}
            className="w-full h-full border-0"
            title={selected.label}
            sandbox="allow-scripts allow-forms"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-[var(--text-muted)]">Select a bookmark above</p>
          </div>
        )}
      </div>
    </div>
  )
}
