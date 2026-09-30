/**
 * Pure ScrollDirector adapters — testable without Lenis / ScrollTrigger / DOM layout.
 */

import type { ChapterDef } from '@/lib/experience-state'

export function readDocumentProgress(
  scrollY: number,
  scrollHeight: number,
  viewportHeight: number,
): number {
  const max = scrollHeight - viewportHeight
  return max > 0 ? scrollY / max : 0
}

export function clampScrollVelocity(velocity: number, scale = 40, max = 1.5): number {
  const v = velocity / scale
  return Math.min(max, Math.max(-max, v))
}

/** ScrollTrigger pin end string from CHAPTER_SCRIPT.pin (viewport fraction). */
export function pinEndFromFraction(pin: number): string {
  return `+=${Math.round(pin * 100)}%`
}

export function workRailTravel(scrollWidth: number, viewportWidth: number): number {
  return Math.max(0, scrollWidth - viewportWidth)
}

export type ChapterPinPlan = {
  id: ChapterDef['id']
  pin: true
  end: string
}

/** Chapters that own a vertical pin (work rail pins separately). */
export function planChapterPins(script: readonly ChapterDef[]): ChapterPinPlan[] {
  return script
    .filter((c): c is ChapterDef & { pin: number } => typeof c.pin === 'number' && c.pin > 0)
    .map((c) => ({
      id: c.id,
      pin: true as const,
      end: pinEndFromFraction(c.pin),
    }))
}

export type HeadlineToken = { kind: 'space'; value: string } | { kind: 'word'; value: string }

/** Split headline text into space/word tokens (no DOM). */
export function tokenizeHeadline(text: string): HeadlineToken[] {
  const tokens: HeadlineToken[] = []
  for (const token of text.split(/(\s+)/)) {
    if (!token) continue
    if (/^\s+$/.test(token)) tokens.push({ kind: 'space', value: token })
    else tokens.push({ kind: 'word', value: token })
  }
  return tokens
}

/**
 * DOM adapter for word-split headlines. Idempotent via data-split.
 * Returns word elements ready for GSAP.
 */
export function splitHeadlineWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === 'true') {
    return Array.from(el.querySelectorAll<HTMLElement>('.split-word'))
  }
  const text = el.textContent ?? ''
  el.textContent = ''
  el.dataset.split = 'true'
  const words: HTMLElement[] = []
  for (const token of tokenizeHeadline(text)) {
    if (token.kind === 'space') {
      el.appendChild(document.createTextNode(token.value))
      continue
    }
    const wrap = document.createElement('span')
    wrap.className = 'split-word-wrap'
    wrap.style.display = 'inline-block'
    wrap.style.overflow = 'hidden'
    wrap.style.verticalAlign = 'bottom'
    const word = document.createElement('span')
    word.className = 'split-word'
    word.style.display = 'inline-block'
    word.textContent = token.value
    wrap.appendChild(word)
    el.appendChild(wrap)
    words.push(word)
  }
  return words
}
