/** Shared ambient playback — no React, safe for Preferences + AudioBus. */

const AMBIENT_SRC = '/audio/ambient-bright.m4a'
const AMBIENT_VOLUME = 0.2
const FADE_MS = 700

let ambientEl: HTMLAudioElement | null = null
let fadeTimer: number | null = null
let desiredPlaying = false
let muted = true

export function setAmbientMutedFlag(next: boolean): void {
  muted = next
}

function getAmbientElement(): HTMLAudioElement {
  if (ambientEl) {
    if (!ambientEl.src.endsWith(AMBIENT_SRC) && !ambientEl.src.includes('ambient-bright')) {
      ambientEl.pause()
      ambientEl = null
    } else {
      return ambientEl
    }
  }
  const el = new Audio(AMBIENT_SRC)
  el.loop = true
  el.preload = 'auto'
  el.volume = 0
  el.muted = true
  ambientEl = el
  return el
}

function clearFade(): void {
  if (fadeTimer !== null) {
    window.clearInterval(fadeTimer)
    fadeTimer = null
  }
}

function fadeVolume(el: HTMLAudioElement, to: number, ms = FADE_MS): Promise<void> {
  clearFade()
  const from = el.volume
  const steps = Math.max(1, Math.round(ms / 32))
  let step = 0
  return new Promise((resolve) => {
    fadeTimer = window.setInterval(() => {
      step += 1
      const t = Math.min(1, step / steps)
      el.volume = Math.max(0, Math.min(1, from + (to - from) * t))
      if (t >= 1) {
        clearFade()
        resolve()
      }
    }, 32)
  })
}

export async function startAmbient(): Promise<void> {
  desiredPlaying = true
  try {
    if (muted) return
    const el = getAmbientElement()
    el.muted = false
    if (el.paused) await el.play()
    if (!desiredPlaying || muted) {
      el.pause()
      el.muted = true
      el.volume = 0
      return
    }
    await fadeVolume(el, AMBIENT_VOLUME)
    if (!desiredPlaying || muted) {
      el.muted = true
      el.volume = 0
      el.pause()
    }
  } catch {
    // unlock / autoplay may fail until a gesture
  }
}

export async function stopAmbient(): Promise<void> {
  desiredPlaying = false
  try {
    const el = ambientEl
    if (!el) return
    await fadeVolume(el, 0, 350)
    el.muted = true
    el.volume = 0
    el.pause()
  } catch {
    // ignore
  }
}
