import { createContext, useContext, useRef, useState, useCallback, type ReactNode } from 'react'
import { Howl } from 'howler'
import { setMusicPlaying } from '@/effects/soundEngine'

interface Track {
  id: string
  title: string
  artist: string
  src: string
  cover?: string
  duration?: number
}

interface MusicContextValue {
  currentTrack: Track | null
  isPlaying: boolean
  progress: number
  volume: number
  play: (track: Track) => void
  pause: () => void
  resume: () => void
  seek: (seconds: number) => void
  setVolume: (v: number) => void
  stop: () => void
}

const MusicContext = createContext<MusicContextValue | null>(null)

export function MusicProvider({ children }: { children: ReactNode }) {
  const howlRef = useRef<Howl | null>(null)
  const rafRef = useRef<number>(0)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolumeState] = useState(0.8)

  const stopProgressLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
  }, [])

  const startProgressLoop = useCallback(() => {
    const tick = () => {
      if (howlRef.current?.playing()) {
        setProgress(howlRef.current.seek() as number)
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const play = useCallback((track: Track) => {
    if (howlRef.current) {
      howlRef.current.unload()
      stopProgressLoop()
    }

    const howl = new Howl({
      src: [track.src],
      volume,
      html5: true,
      onplay: () => {
        setIsPlaying(true)
        startProgressLoop()
        setMusicPlaying(true)
      },
      onend: () => {
        setIsPlaying(false)
        setProgress(0)
        stopProgressLoop()
        setMusicPlaying(false)
      },
      onpause: () => {
        setIsPlaying(false)
        stopProgressLoop()
        setMusicPlaying(false)
      },
    })

    howlRef.current = howl
    setCurrentTrack(track)
    setProgress(0)
    howl.play()
  }, [volume, startProgressLoop, stopProgressLoop])

  const pause = useCallback(() => {
    howlRef.current?.pause()
  }, [])

  const resume = useCallback(() => {
    howlRef.current?.play()
    setMusicPlaying(true)
  }, [])

  const seek = useCallback((seconds: number) => {
    howlRef.current?.seek(seconds)
  }, [])

  const setVolume = useCallback((v: number) => {
    setVolumeState(v)
    howlRef.current?.volume(v)
  }, [])

  const stop = useCallback(() => {
    howlRef.current?.stop()
    setIsPlaying(false)
    setProgress(0)
    stopProgressLoop()
    setMusicPlaying(false)
  }, [stopProgressLoop])

  return (
    <MusicContext.Provider
      value={{ currentTrack, isPlaying, progress, volume, play, pause, resume, seek, setVolume, stop }}
    >
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic(): MusicContextValue {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useMusic must be used inside MusicProvider')
  return ctx
}
