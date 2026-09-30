'use client'

import { useEffect, useRef } from 'react'
import { usePreferences } from '@/components/layout/PreferencesProvider'
import { setAmbientMutedFlag, startAmbient, stopAmbient } from '@/lib/ambient-audio'
import { experienceState } from '@/lib/experience-state'
import { useReducedMotion } from '@/lib/use-reduced-motion'

function getAudioContext(): AudioContext {
  const w = window as Window & {
    webkitAudioContext?: typeof AudioContext
    __portfolioAudioCtx?: AudioContext
  }
  if (!w.__portfolioAudioCtx) {
    const Ctor = window.AudioContext || w.webkitAudioContext
    if (!Ctor) throw new Error('AudioContext unavailable')
    w.__portfolioAudioCtx = new Ctor()
  }
  return w.__portfolioAudioCtx
}

/** Soft whoosh — chapter accent only (never while muted). */
export function playWhoosh(intensity = 1): void {
  if (experienceState.audioMuted) return
  try {
    const ac = getAudioContext()
    void ac.resume()
    const now = ac.currentTime
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    const filter = ac.createBiquadFilter()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(180, now)
    osc.frequency.exponentialRampToValueAtTime(48, now + 0.45)
    filter.type = 'lowpass'
    filter.frequency.value = 700
    const peak = 0.06 * intensity
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45)
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ac.destination)
    osc.start(now)
    osc.stop(now + 0.5)
  } catch {
    // Audio optional
  }
}

export async function unlockAudio(): Promise<void> {
  try {
    const ac = getAudioContext()
    if (ac.state === 'suspended') await ac.resume()
  } catch {
    // ignore
  }
  await startAmbient()
  playWhoosh(0.55)
}

export { startAmbient, stopAmbient }

/**
 * Ambient bus — HTMLAudio mute is authoritative.
 * Default muted; unmute requires a UI click.
 */
export function AudioBus() {
  const { audioMuted } = usePreferences()
  const reduced = useReducedMotion()
  const lastChapter = useRef(experienceState.activeChapter)

  useEffect(() => {
    experienceState.audioMuted = audioMuted
    setAmbientMutedFlag(audioMuted || reduced)

    if (reduced || audioMuted) {
      void stopAmbient()
      return
    }
    void unlockAudio()
  }, [audioMuted, reduced])

  useEffect(() => {
    if (reduced || audioMuted) return

    let raf = 0
    const tick = () => {
      if (experienceState.activeChapter !== lastChapter.current) {
        lastChapter.current = experienceState.activeChapter
        if (!experienceState.audioMuted) playWhoosh(0.85)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced, audioMuted])

  useEffect(() => {
    return () => {
      void stopAmbient()
    }
  }, [])

  return null
}
