interface Props { onClose: () => void }

export function BuiltPlaceholder({ onClose: _onClose }: Props) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-3">🔧</p>
        <p className="text-sm text-[var(--text-muted)]">Experiments — coming soon</p>
      </div>
    </div>
  )
}
