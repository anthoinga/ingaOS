import { useState, useEffect } from 'react'
import { useMusic } from '@/contexts/MusicContext'
import { playSound, startIdleLoop, stopIdleLoop, setAmbientTrackIndex } from '@/effects/soundEngine'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  MoreHorizontal,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

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

  // Menu Open State for Mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    <div className="flex items-center gap-6 select-none font-mono text-base text-[var(--text-primary)] flex-nowrap flex-shrink-0 relative">
      {/* Sun Symbol Section */}
      <div className="flex items-center flex-nowrap flex-shrink-0">
        <span className="opacity-95 text-xl sm:text-3xl leading-none">☀</span>
      </div>

      {/* Separator 1 (always visible since either Media Controls or "..." Menu is shown on its right) */}
      <div className="w-[1px] h-5 bg-white/15 shrink-0" />

      {/* Media Player Controls Section (visible on >=sm) */}
      <div className="hidden sm:flex items-center gap-4 flex-nowrap flex-shrink-0">
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

      {/* Separator 2 (visible on >=md between Media Controls and System Health) */}
      <div className="hidden md:block w-[1px] h-5 bg-white/15 shrink-0" />

      {/* System Health Section (visible on >=md) */}
      <div className="hidden md:flex items-center gap-2.5 opacity-90 flex-nowrap flex-shrink-0" title="System Health: Active">
        <SystemHealthGrid />
        <span className="tracking-tight text-[10px] sm:text-xs">SYS_OK</span>
      </div>

      {/* "..." Menu Button (visible on mobile only, <sm) */}
      <div className="flex sm:hidden items-center flex-nowrap flex-shrink-0">
        <button
          onClick={() => {
            playSound('select_confirm')
            setIsMenuOpen(!isMenuOpen)
          }}
          className="opacity-70 hover:opacity-100 transition-opacity duration-150 p-0.5 focus:outline-none flex-shrink-0"
          title="More System Controls"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Separator 3 (always visible between Clock and whatever is on its left: Health/Menu/Media) */}
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

      {/* Dropdown Menu for Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Transparent backdrop overlay to dismiss on tap */}
            <div 
              className="fixed inset-0 z-40 cursor-default" 
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* The actual menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute top-full right-0 mt-3 z-50 w-72 rounded-lg border border-white/10 bg-neutral-900/90 backdrop-blur-md p-4 shadow-2xl flex flex-col gap-4 text-[var(--text-primary)]"
            >
              {/* Media Controls inside the dropdown */}
              <div className="flex flex-col gap-2 w-full py-1">
                <span className="text-[10px] text-[var(--text-muted)] font-mono tracking-wider">NOW PLAYING</span>
                <div className="flex items-center justify-between w-full bg-white/5 rounded-md p-2 border border-white/5">
                  <span className="font-mono text-xs font-medium tracking-tight truncate max-w-[140px]">
                    {isMediaActive && music.currentTrack ? music.currentTrack.title : AMBIENT_TRACKS[ambientIndex].desc}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePrev}
                      className="opacity-80 hover:opacity-100 active:scale-90 transition-all p-1 focus:outline-none flex-shrink-0"
                      title="Previous Track"
                    >
                      <SkipBack size={18} />
                    </button>
                    <button
                      onClick={handleTogglePlay}
                      className="opacity-80 hover:opacity-100 active:scale-90 transition-all p-1 focus:outline-none flex-shrink-0"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <button
                      onClick={handleNext}
                      className="opacity-80 hover:opacity-100 active:scale-90 transition-all p-1 focus:outline-none flex-shrink-0"
                      title="Next Track"
                    >
                      <SkipForward size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Separator line inside dropdown */}
              <div className="h-[1px] w-full bg-white/10" />

              {/* System Health inside the dropdown */}
              <div className="flex items-center justify-between w-full py-1">
                <span className="text-[10px] text-[var(--text-muted)] font-mono tracking-wider">SYSTEM STATUS</span>
                <div className="flex items-center gap-2 opacity-90">
                  <SystemHealthGrid />
                  <span className="tracking-tight text-xs font-mono">SYS_OK</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

