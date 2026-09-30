'use client'

import {
  Desktop,
  Gauge,
  Moon,
  SpeakerHigh,
  SpeakerSlash,
  Sun,
  WaveformSlash,
  WaveSine,
} from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import { usePreferences } from '@/components/layout/PreferencesProvider'
import { cn } from '@/lib/utils'

const controlClass =
  'inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-[var(--radius)] border border-line text-ink-muted transition-[color,border-color,background-color] duration-200 hover:border-accent hover:text-accent'

export function PreferenceControls() {
  const t = useTranslations('Preferences')
  const {
    themePreference,
    cycleTheme,
    reducedMotion,
    toggleReducedMotion,
    audioMuted,
    toggleAudioMuted,
    qualityPreference,
    cycleQuality,
  } = usePreferences()

  const themeLabel =
    themePreference === 'light'
      ? t('themeLight')
      : themePreference === 'dark'
        ? t('themeDark')
        : t('themeSystem')

  const ThemeIcon = themePreference === 'light' ? Sun : themePreference === 'dark' ? Moon : Desktop

  const qualityLabel =
    qualityPreference === 'cinematic'
      ? t('qualityCinematic')
      : qualityPreference === 'balanced'
        ? t('qualityBalanced')
        : qualityPreference === 'lite'
          ? t('qualityLite')
          : t('qualityAuto')

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={controlClass}
        aria-label={`${t('theme')}: ${themeLabel}. ${t('themeCycle')}`}
        title={themeLabel}
        onClick={cycleTheme}
      >
        <ThemeIcon className="size-4" weight="bold" aria-hidden />
      </button>

      <button
        type="button"
        className={cn(controlClass, reducedMotion && 'border-accent text-accent')}
        aria-label={reducedMotion ? t('motionOn') : t('motionOff')}
        aria-pressed={reducedMotion}
        title={reducedMotion ? t('motionOn') : t('motionOff')}
        onClick={toggleReducedMotion}
      >
        {reducedMotion ? (
          <WaveformSlash className="size-4" weight="bold" aria-hidden />
        ) : (
          <WaveSine className="size-4" weight="bold" aria-hidden />
        )}
      </button>

      <button
        type="button"
        className={cn(controlClass, !audioMuted && 'border-accent text-accent')}
        aria-label={audioMuted ? t('audioOn') : t('audioOff')}
        aria-pressed={!audioMuted}
        title={audioMuted ? t('audioOn') : t('audioOff')}
        onClick={toggleAudioMuted}
      >
        {audioMuted ? (
          <SpeakerSlash className="size-4" weight="bold" aria-hidden />
        ) : (
          <SpeakerHigh className="size-4" weight="bold" aria-hidden />
        )}
      </button>

      <button
        type="button"
        className={cn(controlClass, qualityPreference !== 'auto' && 'border-accent text-accent')}
        aria-label={`${t('quality')}: ${qualityLabel}`}
        title={qualityLabel}
        onClick={cycleQuality}
      >
        <Gauge className="size-4" weight="bold" aria-hidden />
      </button>
    </div>
  )
}
