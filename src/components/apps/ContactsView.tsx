import contacts from '@/data/contacts.json'
import type { AppProps } from '@/types'

export function ContactsView({ onClose: _onClose }: AppProps) {
  return (
    <div className="h-full overflow-y-auto px-6 py-6 max-w-sm">
      <h2 className="text-lg font-display font-medium text-[var(--text-primary)] mb-4">Contacts</h2>
      <div className="flex flex-col gap-2">
        {contacts.map((c) => (
          <a
            key={c.id}
            href={c.url}
            target={c.url.startsWith('mailto') ? undefined : '_blank'}
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-3 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] transition-colors"
          >
            <span className="text-2xl">{c.icon}</span>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{c.label}</p>
              <p className="text-xs text-[var(--text-muted)]">{c.value}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
