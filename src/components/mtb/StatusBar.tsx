import { useState, useEffect } from 'react'
import { useMusic } from '@/contexts/MusicContext'
import { playSound, startIdleLoop, stopIdleLoop, setAmbientTrackIndex } from '@/effects/soundEngine'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from 'lucide-react'

const AMBIENT_TRACKS = [
  { name: 'Sumaq', desc: 'SUMAQ' },
  { name: 'Kawsay', desc: 'KAWSAY' },
  { name: 'Phuyu', desc: 'PHUYU' },
]

function SystemHealthGrid() {
  const numRows = 5
  const numCols = 16

  // Pre-fill history array for 16 columns
  const [history, setHistory] = useState<number[]>([2, 3, 2, 3, 4, 3, 2, 1, 2, 3, 4, 3, 2, 3, 4, 3])

  useEffect(() => {
    const interval = setInterval(() => {
      setHistory((prev) => {
        const last = prev[prev.length - 1]
        // Smooth random walk for CPU-like activity
        const change = Math.random() > 0.5 ? 1 : -1
        const next = Math.max(1, Math.min(5, last + change))
        return [...prev.slice(1), next]
      })
    }, 180) // update every 180ms for a natural scrolling speed

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center shrink-0 py-0.5" title="System Status: Active">
      <div 
        className="grid shrink-0" 
        style={{ 
          gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))`,
          gap: '1px',
          width: `${numCols * 3 + (numCols - 1) * 1}px`
        }}
      >
        {Array.from({ length: numRows }).map((_, r) =>
          Array.from({ length: numCols }).map((_, c) => {
            const height = history[c]
            const topRow = 5 - height

            let dotClass = 'bg-[var(--accent-mint)] opacity-[0.06]'

            if (r === topRow) {
              // Top line of the graph (highlighted)
              dotClass = 'bg-[var(--accent-mint)] opacity-[0.95]'
            } else if (r > topRow) {
              // Filled area under the line
              dotClass = 'bg-[var(--accent-mint)] opacity-[0.25]'
            }

            return (
              <div
                key={`${r}-${c}`}
                className={`w-[3px] h-[3px] rounded-[1px] transition-all duration-150 ${dotClass}`}
              />
            )
          })
        )}
      </div>
    </div>
  )
}

export function StatusBar() {
  const music = useMusic()
  const [ambientIndex, setAmbientIndex] = useState(0)
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(true)

  // Date and Time
  const [currentTime, setCurrentTime] = useState(new Date())

  const isMediaActive = music.currentTrack !== null
  const isPlaying = isMediaActive ? music.isPlaying : isAmbientPlaying

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleTogglePlay = () => {
    playSound('select_confirm')
    if (isMediaActive) {
      if (music.isPlaying) {
        music.pause()
      } else {
        music.resume()
      }
    } else {
      if (isAmbientPlaying) {
        stopIdleLoop()
        setIsAmbientPlaying(false)
      } else {
        startIdleLoop()
        setIsAmbientPlaying(true)
      }
    }
  }

  const handleNext = () => {
    playSound('tick_horizontal')
    const nextIdx = (ambientIndex + 1) % AMBIENT_TRACKS.length
    setAmbientIndex(nextIdx)
    setAmbientTrackIndex(nextIdx)
    if (!isAmbientPlaying && !isMediaActive) {
      startIdleLoop()
      setIsAmbientPlaying(true)
    }
  }

  const handlePrev = () => {
    playSound('tick_horizontal')
    const prevIdx = (ambientIndex - 1 + AMBIENT_TRACKS.length) % AMBIENT_TRACKS.length
    setAmbientIndex(prevIdx)
    setAmbientTrackIndex(prevIdx)
    if (!isAmbientPlaying && !isMediaActive) {
      startIdleLoop()
      setIsAmbientPlaying(true)
    }
  }

  useEffect(() => {
    if (isMediaActive && music.isPlaying) {
      setIsAmbientPlaying(false)
    }
  }, [isMediaActive, music.isPlaying])

  // Formatting helpers for PSP format date
  const formatDate = (date: Date) => {
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    const month = monthNames[date.getMonth()]
    const day = date.getDate()
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dayOfWeek = dayNames[date.getDay()]
    return `${month} ${day} ${dayOfWeek}`
  }

  const hours = String(currentTime.getHours() % 12 || 12).padStart(2, '0')
  const minutes = String(currentTime.getMinutes()).padStart(2, '0')
  const ampm = currentTime.getHours() >= 12 ? 'PM' : 'AM'
  const isColonVisible = currentTime.getSeconds() % 2 === 0

  return (
    <div className="flex items-center gap-6 select-none font-mono text-base text-[var(--text-primary)] flex-nowrap flex-shrink-0">
      {/* Sun Symbol Section */}
      <div className="flex items-center flex-nowrap flex-shrink-0">
        <span className="opacity-95 text-xl sm:text-3xl leading-none">☀</span>
      </div>

      {/* Vertical Separator */}
      <div className="w-[1px] h-5 bg-white/15 shrink-0" />

      {/* Media Player Controls Section */}
      <div className="flex items-center gap-4 flex-nowrap flex-shrink-0">
        <span
          className="font-medium tracking-tight opacity-90 max-w-[150px] truncate select-none"
          style={{ fontSize: 'var(--text-ui-sm)' }}
        >
          {isMediaActive && music.currentTrack ? music.currentTrack.title : AMBIENT_TRACKS[ambientIndex].desc}
        </span>
        <div className="flex items-center gap-2 flex-nowrap flex-shrink-0">
          <button
            onClick={handlePrev}
            className="opacity-70 hover:opacity-100 transition-opacity duration-150 p-0.5 focus:outline-none flex-shrink-0"
            title="Previous Track"
          >
            <SkipBack size={16} />
          </button>
          <button
            onClick={handleTogglePlay}
            className="opacity-70 hover:opacity-100 transition-opacity duration-150 p-0.5 focus:outline-none flex-shrink-0"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={handleNext}
            className="opacity-70 hover:opacity-100 transition-opacity duration-150 p-0.5 focus:outline-none flex-shrink-0"
            title="Next Track"
          >
            <SkipForward size={16} />
          </button>
        </div>
      </div>

      {/* Vertical Separator */}
      <div className="w-[1px] h-5 bg-white/15 shrink-0" />

      {/* System Health Section */}
      <div className="flex items-center gap-2.5 opacity-90 flex-nowrap flex-shrink-0" title="System Health: Active">
        <SystemHealthGrid />
        <span className="tracking-tight text-[10px] sm:text-xs">SYS_OK</span>
      </div>

      {/* Vertical Separator */}
      <div className="w-[1px] h-5 bg-white/15 shrink-0" />

      {/* Date & Time Clock Section */}
      <div className="flex items-center gap-2.5 opacity-90 tabular-nums flex-nowrap flex-shrink-0" style={{ fontSize: 'var(--text-ui-sm)' }}>
        <span>{formatDate(currentTime)}</span>
        <span className="font-bold text-[var(--text-primary)] flex items-center flex-nowrap flex-shrink-0">
          <span>{hours}</span>
          <span className={`transition-opacity duration-100 ${isColonVisible ? 'opacity-100' : 'opacity-20'}`}>:</span>
          <span>{minutes}</span>
          <span className="ml-1.5 text-sm font-medium opacity-80" style={{ fontSize: 'var(--text-ui-xs)' }}>{ampm}</span>
        </span>
      </div>
    </div>
  )
}
