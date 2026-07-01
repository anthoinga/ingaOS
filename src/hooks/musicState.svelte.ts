import type { Howl as HowlType } from 'howler'
import { setMusicPlaying } from '@/effects/soundEngine'

export interface Track {
  id: string
  title: string
  artist: string
  src: string
  cover?: string
  duration?: number
}

export class MusicState {
  currentTrack = $state<Track | null>(null)
  isPlaying = $state(false)
  progress = $state(0)
  volume = $state(0.8)

  private howl: HowlType | null = null
  private rafId = 0

  private startProgressLoop() {
    const tick = () => {
      if (this.howl?.playing()) {
        this.progress = this.howl.seek() as number
        this.rafId = requestAnimationFrame(tick)
      }
    }
    this.rafId = requestAnimationFrame(tick)
  }

  private stopProgressLoop() {
    cancelAnimationFrame(this.rafId)
  }

  async play(track: Track) {
    if (this.howl) {
      this.howl.unload()
      this.stopProgressLoop()
    }

    const { Howl } = await import('howler')

    this.howl = new Howl({
      src: [track.src],
      volume: this.volume,
      html5: true,
      onplay: () => {
        this.isPlaying = true
        this.startProgressLoop()
        setMusicPlaying(true)
      },
      onend: () => {
        this.isPlaying = false
        this.progress = 0
        this.stopProgressLoop()
        setMusicPlaying(false)
      },
      onpause: () => {
        this.isPlaying = false
        this.stopProgressLoop()
        setMusicPlaying(false)
      },
    })

    this.currentTrack = track
    this.progress = 0
    this.howl.play()
  }

  pause() {
    this.howl?.pause()
  }

  resume() {
    this.howl?.play()
    setMusicPlaying(true)
  }

  seek(seconds: number) {
    this.howl?.seek(seconds)
    this.progress = seconds
  }

  setVolume(v: number) {
    this.volume = v
    this.howl?.volume(v)
  }

  stop() {
    this.howl?.stop()
    this.isPlaying = false
    this.progress = 0
    this.stopProgressLoop()
    setMusicPlaying(false)
  }
}

export const musicState = new MusicState()
