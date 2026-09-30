export type ThemePreference = 'light' | 'dark' | 'system'
export type MotionPreference = 'system' | 'reduce' | 'full'
export type QualityPreference = 'auto' | 'cinematic' | 'balanced'

export const THEME_STORAGE_KEY = 'pref-theme'
export const MOTION_STORAGE_KEY = 'pref-motion'
export const AUDIO_STORAGE_KEY = 'pref-audio-muted'
export const QUALITY_STORAGE_KEY = 'pref-quality'

export const THEME_ORDER: ThemePreference[] = ['system', 'light', 'dark']
export const QUALITY_ORDER: QualityPreference[] = ['auto', 'cinematic', 'balanced']

export function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
}

export function isMotionPreference(value: string | null): value is MotionPreference {
  return value === 'system' || value === 'reduce' || value === 'full'
}

export function isQualityPreference(value: string | null): value is QualityPreference {
  return value === 'auto' || value === 'cinematic' || value === 'balanced'
}

export function resolveTheme(preference: ThemePreference, systemDark: boolean): 'light' | 'dark' {
  if (preference === 'light') return 'light'
  if (preference === 'dark') return 'dark'
  return systemDark ? 'dark' : 'light'
}

export function resolveReducedMotion(preference: MotionPreference, systemReduce: boolean): boolean {
  if (preference === 'reduce') return true
  if (preference === 'full') return false
  return systemReduce
}

export function nextTheme(current: ThemePreference): ThemePreference {
  const index = THEME_ORDER.indexOf(current)
  return THEME_ORDER[(index + 1) % THEME_ORDER.length] ?? 'system'
}

export function nextQuality(current: QualityPreference): QualityPreference {
  const index = QUALITY_ORDER.indexOf(current)
  return QUALITY_ORDER[(index + 1) % QUALITY_ORDER.length] ?? 'auto'
}

export function nextMotionPreference(
  current: MotionPreference,
  systemReduce: boolean,
): MotionPreference {
  const reduced = resolveReducedMotion(current, systemReduce)
  if (reduced) {
    return systemReduce ? 'full' : 'system'
  }
  return 'reduce'
}

export function applyDocumentPreferences(
  resolvedTheme: 'light' | 'dark',
  motionPreference: MotionPreference,
  systemReduce: boolean,
  quality: QualityPreference = 'auto',
): void {
  const root = document.documentElement
  root.classList.toggle('dark', resolvedTheme === 'dark')
  root.style.colorScheme = resolvedTheme
  root.dataset.theme = resolvedTheme === 'dark' ? 'void' : 'day'
  root.dataset.quality = quality

  if (motionPreference === 'full') {
    root.dataset.reduceMotion = 'false'
  } else if (resolveReducedMotion(motionPreference, systemReduce)) {
    root.dataset.reduceMotion = 'true'
  } else {
    delete root.dataset.reduceMotion
  }
}

export const preferencesBootstrapScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}')||'dark';var root=document.documentElement;var dark=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(t==='light')dark=false;if(t!=='light'&&t!=='dark'&&t!=='system')dark=true;root.classList.toggle('dark',dark);root.dataset.theme=dark?'void':'day';root.style.colorScheme=dark?'dark':'light';var m=localStorage.getItem('${MOTION_STORAGE_KEY}')||'system';var sysReduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(m==='full')root.dataset.reduceMotion='false';else if(m==='reduce'||(m==='system'&&sysReduce))root.dataset.reduceMotion='true';else delete root.dataset.reduceMotion;var q=localStorage.getItem('${QUALITY_STORAGE_KEY}')||'auto';if(q==='lite')q='auto';root.dataset.quality=q;}catch(e){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}})();`
