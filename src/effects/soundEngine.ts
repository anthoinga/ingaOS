import type { SoundName } from '@/types'

let ctx: AudioContext | null = null
let masterFilterNode: BiquadFilterNode | null = null
let masterGainNode: GainNode | null = null

function getCtx(): AudioContext {
  if (!ctx) {
    const AudioContextClass =
      window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!
    ctx = new AudioContextClass()
  }
  return ctx
}

export function getMasterGain(): GainNode {
  const c = getCtx()
  if (!masterGainNode) {
    masterGainNode = c.createGain()
    masterGainNode.gain.setValueAtTime(1.0, c.currentTime)
    masterGainNode.connect(c.destination)
  }
  return masterGainNode
}

export function getMasterFilter(): BiquadFilterNode {
  const c = getCtx()
  if (!masterFilterNode) {
    masterFilterNode = c.createBiquadFilter()
    masterFilterNode.type = 'lowpass'
    masterFilterNode.frequency.setValueAtTime(20000.0, c.currentTime)
    masterFilterNode.connect(getMasterGain())
  }
  return masterFilterNode
}

export function setMuffled(muffled: boolean): void {
  const c = getCtx()
  const filter = getMasterFilter()
  const gainNode = getMasterGain()
  
  const targetFreq = muffled ? 120.0 : 20000.0
  const targetGain = muffled ? 0.95 : 1.0
  const duration = 0.8
  
  filter.frequency.cancelScheduledValues(c.currentTime)
  filter.frequency.setValueAtTime(filter.frequency.value, c.currentTime)
  filter.frequency.exponentialRampToValueAtTime(targetFreq, c.currentTime + duration)

  gainNode.gain.cancelScheduledValues(c.currentTime)
  gainNode.gain.setValueAtTime(gainNode.gain.value, c.currentTime)
  gainNode.gain.linearRampToValueAtTime(targetGain, c.currentTime + duration)
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
  gain.connect(getMasterFilter())
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
  gain.connect(getMasterFilter())
  src.start(now)
  src.stop(now + dur)
}

function synthesizeBootUp(): void {
  const c = getCtx()
  const now = c.currentTime
  
  // Frequencies for a warm, detuned major9 swell (C3, G3, C4, E4, G4)
  const freqs = [130.81, 196.00, 261.63, 329.63, 392.00]
  
  freqs.forEach((freq, index) => {
    const osc = c.createOscillator()
    const gain = c.createGain()
    
    // Mix sine and triangle oscillators for analog warmth
    osc.type = index % 2 === 0 ? 'sine' : 'triangle'
    osc.frequency.setValueAtTime(freq, now)
    
    // Detune voices slightly for chorusing width
    osc.detune.setValueAtTime(index * 4 - 8, now)
    
    gain.gain.setValueAtTime(0, now)
    // 1.0s swell attack
    gain.gain.linearRampToValueAtTime(0.06, now + 1.0)
    // Sustain
    gain.gain.setValueAtTime(0.06, now + 1.4)
    // 1.4s decay release
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8)
    
    osc.connect(gain)
    gain.connect(getMasterFilter())
    
    osc.start(now)
    osc.stop(now + 2.8)
  })
  
  // Elegant crystalline arpeggiated chime sequence (C5 -> E5 -> G5 -> C6)
  const chimeFreqs = [523.25, 659.25, 783.99, 1046.50]
  chimeFreqs.forEach((freq, idx) => {
    const delay = 0.3 + idx * 0.12 // staggered entry
    const chimeNow = now + delay
    const osc = c.createOscillator()
    const gain = c.createGain()
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, chimeNow)
    
    gain.gain.setValueAtTime(0, chimeNow)
    gain.gain.linearRampToValueAtTime(0.08, chimeNow + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, chimeNow + 0.8)
    
    osc.connect(gain)
    gain.connect(getMasterFilter())
    
    osc.start(chimeNow)
    osc.stop(chimeNow + 0.8)
  })
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
  boot_up: () => synthesizeBootUp(),
}

let schedulerTimer: ReturnType<typeof setInterval> | null = null
let nextNoteTime = 0.0
const scheduleAheadTime = 0.1 // schedule 100ms ahead
const lookahead = 25.0 // run scheduler every 25ms
let currentBeat = 0 // range 0 to 15 (16 steps = 8 beats total)
let ambientTrackIndex = 0

export function setAmbientTrackIndex(index: number): void {
  ambientTrackIndex = index
}

function scheduleNote(step: number, time: number) {
  const c = getCtx()

  if (ambientTrackIndex === 0) {
    // -------------------------------------------------------------
    // TRACK 1: "SUMAQ" (116 BPM, F#m -> D -> E -> C#m)
    // Progressive House - Rhythmic & Warm
    // -------------------------------------------------------------
    let bassFreq = 46.25 // F#1
    if (step >= 4 && step < 8) bassFreq = 36.71 // D1
    else if (step >= 8 && step < 12) bassFreq = 41.20 // E1
    else if (step >= 12 && step < 16) bassFreq = 32.70 // C#1

    const isEven = (step % 2 === 0)
    const bassGainVal = isEven ? 0.04 : 0.14

    const bassOsc = c.createOscillator()
    const bassGain = c.createGain()
    bassOsc.type = 'triangle'
    bassOsc.frequency.setValueAtTime(bassFreq * 2.0, time)
    bassOsc.detune.setValueAtTime(-4, time)
    
    bassGain.gain.setValueAtTime(0.0001, time)
    bassGain.gain.linearRampToValueAtTime(bassGainVal, time + 0.03)
    bassGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.22)
    
    bassOsc.connect(bassGain)
    bassGain.connect(getMasterFilter())
    bassOsc.start(time)
    bassOsc.stop(time + 0.23)

    // Soft Kick Drum
    if (step === 0 || step === 4 || step === 8 || step === 12) {
      const kickOsc = c.createOscillator()
      const kickGain = c.createGain()
      kickOsc.type = 'sine'
      kickOsc.frequency.setValueAtTime(120.0, time)
      kickOsc.frequency.exponentialRampToValueAtTime(40.0, time + 0.08)
      kickGain.gain.setValueAtTime(0.0001, time)
      kickGain.gain.linearRampToValueAtTime(0.12, time + 0.005)
      kickGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.09)
      kickOsc.connect(kickGain)
      kickGain.connect(getMasterFilter())
      kickOsc.start(time)
      kickOsc.stop(time + 0.10)
    }

    // Glassy Arpeggio plucks (Dotted-eighth delay)
    let arpFreq = 0.0
    if (step === 0) arpFreq = 369.99 // F#4
    else if (step === 2) arpFreq = 440.00 // A4
    else if (step === 4) arpFreq = 554.37 // C#5
    else if (step === 6) arpFreq = 493.88 // B4
    else if (step === 8) arpFreq = 415.30 // G#4
    else if (step === 10) arpFreq = 369.99 // F#4
    else if (step === 12) arpFreq = 440.00 // A4
    else if (step === 14) arpFreq = 554.37 // C#5

    if (arpFreq > 0.0) {
      const osc = c.createOscillator()
      const gain = c.createGain()
      const filter = c.createBiquadFilter()
      const delay = c.createDelay()
      const feedback = c.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(arpFreq, time)
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(950.0, time)

      gain.gain.setValueAtTime(0.0001, time)
      gain.gain.linearRampToValueAtTime(0.038, time + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18)

      delay.delayTime.setValueAtTime(0.388, time)
      feedback.gain.setValueAtTime(0.35, time)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(getMasterFilter())
      gain.connect(delay)
      delay.connect(feedback)
      feedback.connect(delay)
      delay.connect(getMasterFilter())

      osc.start(time)
      osc.stop(time + 0.40)
    }

    // Sweeping Pads
    if (step === 0 || step === 8) {
      const chordFreqs = (step === 0)
        ? [185.00, 220.00, 277.18] // F#3, A3, C#4 (F#m)
        : [146.83, 185.00, 220.00] // D3, F#3, A3 (Dmaj)
      chordFreqs.forEach((freq) => {
        const osc = c.createOscillator()
        const gain = c.createGain()
        const filter = c.createBiquadFilter()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, time)
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(500.0, time)
        gain.gain.setValueAtTime(0.0001, time)
        gain.gain.linearRampToValueAtTime(0.02, time + 0.8)
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.9)
        osc.connect(filter)
        filter.connect(gain)
        gain.connect(getMasterFilter())
        osc.start(time)
        osc.stop(time + 2.0)
      })
    }
  } 
  else if (ambientTrackIndex === 1) {
    // -------------------------------------------------------------
    // TRACK 2: "KAWSAY" (118 BPM, Cm -> G# -> Fm -> Bb)
    // ZHU "Cocaine Model" Inspired Late-Night Deep House
    // -------------------------------------------------------------
    
    // Soft Deep House Kick Drum
    if (step === 0 || step === 4 || step === 8 || step === 12) {
      const kickOsc = c.createOscillator()
      const kickGain = c.createGain()
      kickOsc.type = 'sine'
      kickOsc.frequency.setValueAtTime(100.0, time)
      kickOsc.frequency.exponentialRampToValueAtTime(38.0, time + 0.10)
      
      kickGain.gain.setValueAtTime(0.0001, time)
      kickGain.gain.linearRampToValueAtTime(0.09, time + 0.005) // rounded, soft punch
      kickGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.11)
      
      kickOsc.connect(kickGain)
      kickGain.connect(getMasterFilter())
      kickOsc.start(time)
      kickOsc.stop(time + 0.12)
    }

    // Whisper-Quiet Filtered Hi-Hat Ticks
    if (step === 2 || step === 6 || step === 10 || step === 14) {
      const bufSize = c.sampleRate * 0.03
      const buf = c.createBuffer(1, bufSize, c.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1
      
      const noiseSrc = c.createBufferSource()
      noiseSrc.buffer = buf
      
      const noiseFilter = c.createBiquadFilter()
      noiseFilter.type = 'bandpass'
      noiseFilter.frequency.setValueAtTime(5500.0, time)
      noiseFilter.Q.setValueAtTime(3.0, time)
      
      const noiseGain = c.createGain()
      noiseGain.gain.setValueAtTime(0.006, time) // extremely low volume background tick
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.02)
      
      noiseSrc.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(getMasterFilter())
      noiseSrc.start(time)
      noiseSrc.stop(time + 0.03)
    }

    // Deep House Bass (triggers on steps 0, 4, 8, 12 playing jazz progression roots)
    let bassFreq = 65.41 // C2 (Cm7)
    if (step >= 4 && step < 8) bassFreq = 43.65 // F1 (Fm7)
    else if (step >= 8 && step < 12) bassFreq = 58.27 // Bb1 (Bb7)
    else if (step >= 12) bassFreq = 77.78 // Eb2 (Ebmaj7)
    
    if (step === 0 || step === 4 || step === 8 || step === 12) {
      const subOsc = c.createOscillator()
      const subGain = c.createGain()
      subOsc.type = 'sine'
      subOsc.frequency.setValueAtTime(bassFreq, time)
      
      subGain.gain.setValueAtTime(0.0001, time)
      subGain.gain.linearRampToValueAtTime(0.14, time + 0.04)
      subGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.28)
      
      subOsc.connect(subGain)
      subGain.connect(getMasterFilter())
      subOsc.start(time)
      subOsc.stop(time + 0.30)
    }

    // ZHU-Inspired Guitar/Rhodes Glassy Intro Pluck
    let leadFreq = 0.0
    if (step === 0) leadFreq = 392.00 // G4
    else if (step === 2) leadFreq = 466.16 // Bb4
    else if (step === 3) leadFreq = 392.00 // G4
    else if (step === 6) leadFreq = 349.23 // F4
    else if (step === 8) leadFreq = 311.13 // Eb4
    else if (step === 10) leadFreq = 349.23 // F4
    else if (step === 11) leadFreq = 392.00 // G4
    else if (step === 13) leadFreq = 261.63 // C4

    if (leadFreq > 0.0) {
      const osc = c.createOscillator()
      const gain = c.createGain()
      const filter = c.createBiquadFilter()
      const delay = c.createDelay()
      const feedback = c.createGain()

      osc.type = 'triangle' // clean warm guitar/electric piano tine base
      osc.frequency.setValueAtTime(leadFreq, time)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(1600.0, time)
      filter.frequency.exponentialRampToValueAtTime(350.0, time + 0.12) // pluck filter envelope sweep
      filter.Q.setValueAtTime(2.0, time)

      gain.gain.setValueAtTime(0.0001, time)
      gain.gain.linearRampToValueAtTime(0.05, time + 0.003) // clean instant pluck attack
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18) // natural decay

      // 0.381s = dotted-eighth delay at 118 BPM
      delay.delayTime.setValueAtTime(0.381, time)
      feedback.gain.setValueAtTime(0.35, time)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(getMasterFilter())
      gain.connect(delay)
      delay.connect(feedback)
      feedback.connect(delay)
      delay.connect(getMasterFilter())

      osc.start(time)
      osc.stop(time + 0.50)
    }

    // Drifting Warm Jazz Chords (Rhodes-like pads)
    if (step === 0 || step === 4 || step === 8 || step === 12) {
      let chordFreqs = [130.81, 155.56, 196.00, 233.08] // C3, Eb3, G3, Bb3 (Cm7)
      if (step === 4) chordFreqs = [174.61, 207.65, 261.63, 311.13] // F3, Ab3, C4, Eb4 (Fm7)
      else if (step === 8) chordFreqs = [116.54, 146.83, 174.61, 233.08] // Bb2, D3, F3, Ab3 (Bb7)
      else if (step === 12) chordFreqs = [155.56, 196.00, 233.08, 293.66] // Eb3, G3, Bb3, D4 (Ebmaj7)

      chordFreqs.forEach((freq) => {
        const osc = c.createOscillator()
        const gain = c.createGain()
        const filter = c.createBiquadFilter()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, time)
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(320.0, time)
        gain.gain.setValueAtTime(0.0001, time)
        gain.gain.linearRampToValueAtTime(0.02, time + 0.6)
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.2)
        osc.connect(filter)
        filter.connect(gain)
        gain.connect(getMasterFilter())
        osc.start(time)
        osc.stop(time + 1.3)
      })
    }
  } 
  else if (ambientTrackIndex === 2) {
    // -------------------------------------------------------------
    // TRACK 3: "PHUYU" (148 BPM, D -> F#m)
    // Illenium - "In Your Arms" Authentic Intro Arpeggio
    // -------------------------------------------------------------
    
    // Warm atmospheric sub-bass roots (triggers on steps 0 and 8)
    if (step === 0 || step === 8) {
      const bassFreq = (step === 0) ? 36.71 : 46.25 // D1 (D Major) or F#1 (F# Minor)
      
      const subOsc = c.createOscillator()
      const subGain = c.createGain()
      subOsc.type = 'sine'
      subOsc.frequency.setValueAtTime(bassFreq, time)
      
      subGain.gain.setValueAtTime(0.0001, time)
      subGain.gain.linearRampToValueAtTime(0.12, time + 0.12) // soft slow swell
      subGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.70)
      
      subOsc.connect(subGain)
      subGain.connect(getMasterFilter())
      subOsc.start(time)
      subOsc.stop(time + 0.75)
    }

    // Authentic "In Your Arms" picking pattern (D3-A3-D4-A3-F#3-A3-D4-A3 and C#3-A3-C#4-A3-F#3-A3-C#4-A3)
    let leadFreq = 0.0
    if (step < 8) {
      // D Major Section
      if (step === 0) leadFreq = 146.83 // D3
      else if (step === 1) leadFreq = 220.00 // A3
      else if (step === 2) leadFreq = 293.66 // D4
      else if (step === 3) leadFreq = 220.00 // A3
      else if (step === 4) leadFreq = 185.00 // F#3
      else if (step === 5) leadFreq = 220.00 // A3
      else if (step === 6) leadFreq = 293.66 // D4
      else if (step === 7) leadFreq = 220.00 // A3
    } else {
      // F# Minor Section
      if (step === 8) leadFreq = 138.59 // C#3 (bass note change)
      else if (step === 9) leadFreq = 220.00 // A3
      else if (step === 10) leadFreq = 277.18 // C#4
      else if (step === 11) leadFreq = 220.00 // A3
      else if (step === 12) leadFreq = 185.00 // F#3
      else if (step === 13) leadFreq = 220.00 // A3
      else if (step === 14) leadFreq = 277.18 // C#4
      else if (step === 15) leadFreq = 220.00 // A3
    }

    if (leadFreq > 0.0) {
      const osc = c.createOscillator()
      const gain = c.createGain()
      const filter = c.createBiquadFilter()
      const delay = c.createDelay()
      const feedback = c.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(leadFreq, time)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(1200.0, time)
      filter.frequency.exponentialRampToValueAtTime(320.0, time + 0.12) // pluck lowpass sweep
      filter.Q.setValueAtTime(1.5, time)

      gain.gain.setValueAtTime(0.0001, time)
      gain.gain.linearRampToValueAtTime(0.055, time + 0.004) // fast string pluck attack
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.20) // natural pluck decay

      // 0.608s = dotted-eighth delay at 74 BPM
      delay.delayTime.setValueAtTime(0.608, time)
      feedback.gain.setValueAtTime(0.38, time) // spacey guitar reflection

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(getMasterFilter())
      gain.connect(delay)
      delay.connect(feedback)
      feedback.connect(delay)
      delay.connect(getMasterFilter())

      osc.start(time)
      osc.stop(time + 0.45)
    }

    // Cinematic Emotional Background Pad Chords (Dmaj -> F#m)
    if (step === 0 || step === 8) {
      let chordFreqs = [146.83, 185.00, 220.00] // D3, F#3, A3 (Dmaj)
      if (step === 8) chordFreqs = [138.59, 185.00, 220.00] // C#3, F#3, A3 (F#m)

      chordFreqs.forEach((freq) => {
        const osc = c.createOscillator()
        const gain = c.createGain()
        const filter = c.createBiquadFilter()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, time)
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(260.0, time)
        
        gain.gain.setValueAtTime(0.0001, time)
        gain.gain.linearRampToValueAtTime(0.02, time + 0.4) // soft swell
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.8)
        
        osc.connect(filter)
        filter.connect(gain)
        gain.connect(getMasterFilter())
        osc.start(time)
        osc.stop(time + 0.9)
      })
    }
  }
}

function scheduler() {
  const c = getCtx()
  const bpm = ambientTrackIndex === 0 ? 116.0 : ambientTrackIndex === 1 ? 118.0 : 74.0
  const stepLen = 30.0 / bpm
  while (nextNoteTime < c.currentTime + scheduleAheadTime) {
    scheduleNote(currentBeat, nextNoteTime)
    nextNoteTime += stepLen
    currentBeat = (currentBeat + 1) % 16
  }
}

let musicPlaying = false

export function setMusicPlaying(playing: boolean): void {
  musicPlaying = playing
  if (playing) {
    stopIdleLoop()
  } else {
    startIdleLoop()
  }
}

export function startIdleLoop(): void {
  if (isReduced() || musicPlaying) return
  const c = getCtx()
  if (c.state === 'suspended') {
    c.resume().then(() => {
      if (schedulerTimer) return
      nextNoteTime = c.currentTime
      currentBeat = 0
      schedulerTimer = setInterval(scheduler, lookahead)
    }).catch(() => {})
  } else {
    if (schedulerTimer) return
    nextNoteTime = c.currentTime
    currentBeat = 0
    schedulerTimer = setInterval(scheduler, lookahead)
  }
}

export function stopIdleLoop(): void {
  if (schedulerTimer) {
    clearInterval(schedulerTimer)
    schedulerTimer = null
  }
}

export function playSound(name: SoundName): void {
  if (isReduced()) return
  if (ctx?.state === 'suspended') {
    ctx.resume().catch(() => {})
  }
  
  // Auto-start background loop on user gesture
  if (!musicPlaying) {
    startIdleLoop()
  }
  
  SOUNDS[name]()
}

