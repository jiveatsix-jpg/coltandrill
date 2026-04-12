/**
 * sounds.ts — Procedural arcade sound engine using the Web Audio API.
 * No audio files needed. All sounds are synthesised in real time.
 */

let _ctx: AudioContext | null = null

function ctx(): AudioContext {
  if (!_ctx) {
    _ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  // Resume if suspended (browser autoplay policy)
  if (_ctx.state === 'suspended') _ctx.resume()
  return _ctx
}

// ── helpers ────────────────────────────────────────────────────

function tone(
  freq: number,
  startTime: number,
  duration: number,
  gainPeak: number,
  type: OscillatorType = 'square',
  endFreq?: number,
): void {
  const c   = ctx()
  const osc = c.createOscillator()
  const gain = c.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(freq, startTime)
  if (endFreq !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration)
  }

  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(startTime)
  osc.stop(startTime + duration + 0.01)
}

function noise(startTime: number, duration: number, gainPeak: number): void {
  const c      = ctx()
  const bufSz  = c.sampleRate * duration
  const buf    = c.createBuffer(1, bufSz, c.sampleRate)
  const data   = buf.getChannelData(0)
  for (let i = 0; i < bufSz; i++) data[i] = Math.random() * 2 - 1

  const src  = c.createBufferSource()
  const gain = c.createGain()
  src.buffer = buf

  gain.gain.setValueAtTime(gainPeak, startTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

  src.connect(gain)
  gain.connect(c.destination)
  src.start(startTime)
}

// ── public sounds ──────────────────────────────────────────────

/** Bright ascending two-note blip — correct answer */
export function playCorrect(): void {
  const t = ctx().currentTime
  tone(660, t,        0.08, 0.25, 'square')
  tone(880, t + 0.08, 0.12, 0.20, 'square')
}

/** Harsh descending buzz — wrong answer */
export function playWrong(): void {
  const t = ctx().currentTime
  tone(180, t, 0.25, 0.30, 'sawtooth', 80)
  noise(t, 0.18, 0.06)
}

/** Short sharp impact — damage hit on enemy */
export function playHit(): void {
  const t = ctx().currentTime
  tone(440, t,       0.04, 0.35, 'square', 220)
  noise(t, 0.05, 0.12)
}

/** Quick descending power-down — enemy defeated */
export function playDefeated(): void {
  const t = ctx().currentTime
  const notes = [987, 784, 523, 392]
  notes.forEach((freq, i) => {
    tone(freq, t + i * 0.07, 0.10, 0.22, 'square')
  })
}

/** Ascending 3-blip activation — game start */
export function playStart(): void {
  const t = ctx().currentTime
  ;[440, 554, 659].forEach((freq, i) => {
    tone(freq, t + i * 0.09, 0.08, 0.20, 'square')
  })
}

/** 4-note fanfare — game complete */
export function playComplete(): void {
  const t = ctx().currentTime
  const seq = [
    { f: 523, d: 0.10 },
    { f: 659, d: 0.10 },
    { f: 784, d: 0.10 },
    { f: 1047, d: 0.28 },
  ]
  let offset = 0
  seq.forEach(({ f, d }) => {
    tone(f, t + offset, d, 0.22, 'square')
    offset += d + 0.02
  })
}

/** Subtle UI blip — button / level selected */
export function playSelect(): void {
  const t = ctx().currentTime
  tone(880, t, 0.05, 0.12, 'sine')
}

// ─── Background Music (Procedural Loop) ───────────────────
let bgOsc: OscillatorNode | null = null
let bgGain: GainNode | null = null
let bgFilter: BiquadFilterNode | null = null

/** Starts a low, pulsing tactical drone loop */
export function startBackgroundMusic(): void {
  if (bgOsc) return
  const c = ctx()
  
  bgOsc = c.createOscillator()
  bgGain = c.createGain()
  bgFilter = c.createBiquadFilter()

  bgOsc.type = 'sawtooth'
  bgOsc.frequency.setValueAtTime(32.7, c.currentTime) // Low C1

  bgFilter.type = 'lowpass'
  bgFilter.frequency.setValueAtTime(400, c.currentTime)
  bgFilter.Q.setValueAtTime(5, c.currentTime)

  // Pulsing volume LFO
  const lfo = c.createOscillator()
  const lfoGain = c.createGain()
  lfo.frequency.setValueAtTime(0.5, c.currentTime) // 0.5Hz speed
  lfoGain.gain.setValueAtTime(0.02, c.currentTime)
  lfo.connect(lfoGain)
  lfoGain.connect(bgGain.gain)
  lfo.start()

  bgGain.gain.setValueAtTime(0.04, c.currentTime) // Base volume

  bgOsc.connect(bgFilter)
  bgFilter.connect(bgGain)
  bgFilter.connect(c.destination) // or bgGain.connect(c.destination) - wait

  bgOsc.start()
}

/** Stops the background music */
export function stopBackgroundMusic(): void {
  if (bgOsc) {
    try {
      bgOsc.stop()
      bgOsc.disconnect()
    } catch (e) { /* ignore */ }
    bgOsc = null
  }
}

// ─── Bestiary Jam Sequencer ───────────────────────────────

interface Track {
  id: string
  play: (time: number, step: number) => void
}

let jamInterval: number | null = null
let currentStep = 0
const BPM = 126
const STEP_TIME = (60 / BPM) / 4 // 16th notes
const activeTracks = new Set<string>()

const TRACKS: Track[] = [
  {
    id: 'glitch-unit', // Kick
    play: (t, s) => {
      if (s % 4 === 0) {
        tone(60, t, 0.15, 0.4, 'sine', 30)
        noise(t, 0.02, 0.05)
      }
    }
  },
  {
    id: 'neural-worm', // Snare
    play: (t, s) => {
      if (s % 8 === 4) {
        tone(200, t, 0.1, 0.3, 'triangle', 100)
        noise(t, 0.12, 0.2)
      }
    }
  },
  {
    id: 'static-specter', // Closed Hat
    play: (t, s) => {
      if (s % 2 === 0) {
        noise(t, 0.03, 0.1)
      }
    }
  },
  {
    id: 'echo-parasite', // Open Hat
    play: (t, s) => {
      if (s % 8 === 6) {
        noise(t, 0.15, 0.08)
      }
    }
  },
  {
    id: 'data-reaper', // Bass Root
    play: (t, s) => {
      if (s % 16 === 0 || s % 16 === 10) {
        tone(41.2, t, 0.3, 0.25, 'sawtooth', 41.2) // E1
      }
    }
  },
  {
    id: 'binary-wraith', // Bass Octave
    play: (t, s) => {
      if (s % 16 === 8 || s % 16 === 14) {
        tone(82.4, t, 0.2, 0.2, 'sawtooth', 82.4) // E2
      }
    }
  },
  {
    id: 'void-crawler', // Percussion Click
    play: (t, s) => {
      if (s % 4 === 2) {
        tone(1200, t, 0.01, 0.15, 'square', 800)
      }
    }
  },
  {
    id: 'phantom-node', // Clap
    play: (t, s) => {
      if (s % 16 === 12) {
        noise(t, 0.2, 0.25)
        tone(250, t, 0.1, 0.15, 'triangle')
      }
    }
  },
  {
    id: 'zero-daemon', // Low Lead
    play: (t, s) => {
      const notes = [164.8, 196.0, 220.0, 246.9] // E3, G3, A3, B3
      if (s % 8 === 0) tone(notes[Math.floor(s/8)%4], t, 0.4, 0.15, 'square')
    }
  },
  {
    id: 'cipher-beast', // High Lead
    play: (t, s) => {
      if (s % 16 === 4 || s % 16 === 12) {
        tone(659.3, t, 0.1, 0.12, 'sine') // E5
      }
    }
  },
  {
    id: 'rogue-matrix', // Pad 1
    play: (t, s) => {
      if (s % 32 === 0) {
        tone(329.6, t, 2.0, 0.08, 'sawtooth') // E4
      }
    }
  },
  {
    id: 'overload-mind', // Pad 2
    play: (t, s) => {
      if (s % 32 === 16) {
        tone(392.0, t, 2.0, 0.08, 'sawtooth') // G4
      }
    }
  },
  {
    id: 'null-hunter', // Arp
    play: (t, s) => {
      const arp = [329.6, 392.0, 440.0, 493.9]
      tone(arp[s % 4], t, 0.1, 0.1, 'sine')
    }
  },
  {
    id: 'sentinel', // Noise Sweep
    play: (t, s) => {
      if (s % 64 === 0) {
        noise(t, 4.0, 0.03)
      }
    }
  },
  {
    id: 'core-breaker', // Sub Master
    play: (t, s) => {
      if (s % 4 === 0) {
        tone(30, t, 0.5, 0.3, 'sine')
      }
    }
  }
]

export function startBestiaryJam(): void {
  if (jamInterval) return
  const c = ctx()
  currentStep = 0
  
  // Clear any existing active tracks to avoid leftover state
  // activeTracks.clear() // No, we want to keep them if they were toggled? 
  // Actually, usually you want to start fresh or keep previous selection.
  // Let's keep previous selection.

  jamInterval = window.setInterval(() => {
    const t = c.currentTime + 0.1 // buffer for stability
    TRACKS.forEach(track => {
      if (activeTracks.has(track.id)) {
        track.play(t, currentStep)
      }
    })
    currentStep = (currentStep + 1) % 64
  }, STEP_TIME * 1000)
}

export function stopBestiaryJam(): void {
  if (jamInterval) {
    clearInterval(jamInterval)
    jamInterval = null
  }
}

export function toggleTrack(enemyId: string, active: boolean): void {
  if (active) activeTracks.add(enemyId)
  else activeTracks.delete(enemyId)
}

export function isTrackActive(enemyId: string): boolean {
  return activeTracks.has(enemyId)
}
