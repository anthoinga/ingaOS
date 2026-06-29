interface Props { onClose: () => void }

export function GalagaDemo({ onClose: _onClose }: Props) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl mb-4">👾</p>
        <p className="text-lg font-display font-semibold text-[var(--text-primary)] mb-2">Galaga</p>
        <p className="text-sm text-[var(--text-muted)]">Coming soon</p>
      </div>
    </div>
  )
}
