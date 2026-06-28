import type { SoundName } from '@/types'

let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

function isReduced(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function ramp(
  gain: GainNode,
  from: number,
  to: number,
  startAt: number,
  endAt: number,
) {
  gain.gain.setValueAtTime(from, startAt)
  gain.gain.linearRampToValueAtTime(to, endAt)
}

function tone(freq: number, durationMs: number, delayMs = 0): void {
  const c = getCtx()
  const now = c.currentTime + delayMs / 1000
  const dur = durationMs / 1000

  const osc = c.createOscillator()
  const gain = c.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, now)
  gain.gain.setValueAtTime(0, now)
  ramp(gain, 0, 0.3, now, now + 0.005)
  ramp(gain, 0.3, 0, now + 0.005, now + dur)

  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(now)
  osc.stop(now + dur)
}

function whoosh(freqStart: number, freqEnd: number, durationMs: number, delayMs = 0): void {
  const c = getCtx()
  const now = c.currentTime + delayMs / 1000
  const dur = durationMs / 1000

  const bufSize = c.sampleRate * dur
  const buf = c.createBuffer(1, bufSize, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1

  const src = c.createBufferSource()
  src.buffer = buf

  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(freqStart, now)
  filter.frequency.linearRampToValueAtTime(freqEnd, now + dur)
  filter.Q.value = 1

  const gain = c.createGain()
  gain.gain.setValueAtTime(0, now)
  ramp(gain, 0, 0.3, now, now + 0.03)
  ramp(gain, 0.3, 0, now + 0.03, now + dur)

  src.connect(filter)
  filter.connect(gain)
  gain.connect(c.destination)
  src.start(now)
  src.stop(now + dur)
}

const SOUNDS: Record<SoundName, () => void> = {
  tick_horizontal: () => tone(880, 60),
  tick_vertical: () => tone(660, 60),
  select_confirm: () => {
    tone(880, 80)
    tone(1100, 80, 80)
  },
  select_back: () => {
    tone(660, 80)
    tone(440, 80, 80)
  },
  launch_whoosh: () => whoosh(200, 4000, 300),
  close_swoosh: () => whoosh(4000, 200, 300),
}

export function playSound(name: SoundName): void {
  if (isReduced()) return
  // resume suspended context (required after user gesture)
  if (ctx?.state === 'suspended') ctx.resume()
  SOUNDS[name]()
}
