import { useState, useEffect } from 'react'
import { useMusic } from '@/contexts/MusicContext'

interface TrackMeta {
  id: string
  title: string
  artist: string
  src: string
  cover?: string
  duration?: number
}

interface Props { onClose: () => void }

export function MusicPlayer({ onClose: _onClose }: Props) {
  const { currentTrack, isPlaying, progress, volume, play, pause, resume, seek, setVolume } = useMusic()
  const [tracklist, setTracklist] = useState<TrackMeta[]>([])

  useEffect(() => {
    fetch('/music/tracklist.json')
      .then((r) => r.json())
      .then(setTracklist)
      .catch(() => {})
  }, [])

  const duration = currentTrack?.duration ?? 0

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="h-full flex flex-col px-6 py-6 max-w-md">
      {/* Now playing */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-40 h-40 rounded-xl bg-[var(--bg-raised)] flex items-center justify-center mb-4 overflow-hidden">
          {currentTrack?.cover ? (
            <img src={currentTrack.cover} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">🎵</span>
          )}
        </div>
        <p className="font-medium text-[var(--text-primary)] text-center">
          {currentTrack?.title ?? 'No track selected'}
        </p>
        <p className="text-sm text-[var(--text-muted)] text-center">
          {currentTrack?.artist ?? ''}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <input
          type="range"
          min={0}
          max={duration || 1}
          value={progress}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full accent-[var(--accent)]"
        />
        <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
          <span>{fmt(progress)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <button
          onClick={isPlaying ? pause : resume}
          className="w-12 h-12 rounded-full bg-[var(--accent)] text-[var(--bg-primary)] flex items-center justify-center text-lg font-bold"
          disabled={!currentTrack}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs text-[var(--text-muted)]">🔈</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1 accent-[var(--accent)]"
        />
        <span className="text-xs text-[var(--text-muted)]">🔊</span>
      </div>

      {/* Track list */}
      <div className="flex-1 overflow-y-auto">
        {tracklist.map((track) => (
          <button
            key={track.id}
            onClick={() => play(track)}
            className={`w-full flex items-center gap-3 py-2 px-2 rounded-lg text-left transition-colors ${
              currentTrack?.id === track.id
                ? 'bg-[var(--bg-raised)] text-[var(--text-primary)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span className="text-lg shrink-0">
              {currentTrack?.id === track.id && isPlaying ? '▶' : '♪'}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{track.title}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">{track.artist}</p>
            </div>
          </button>
        ))}
        {tracklist.length === 0 && (
          <p className="text-sm text-[var(--text-muted)] text-center py-4">
            Add MP3s to /public/music/ and update tracklist.json
          </p>
        )}
      </div>
    </div>
  )
}
