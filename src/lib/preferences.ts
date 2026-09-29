export type ThemePreference = 'light' | 'dark' | 'system'
export type MotionPreference = 'system' | 'reduce' | 'full'

export const THEME_STORAGE_KEY = 'pref-theme'
export const MOTION_STORAGE_KEY = 'pref-motion'

export const THEME_ORDER: ThemePreference[] = ['system', 'light', 'dark']

export function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
}

export function isMotionPreference(value: string | null): value is MotionPreference {
  return value === 'system' || value === 'reduce' || value === 'full'
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

/** Toggle reduced motion on/off while preserving OS preference when possible. */
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
): void {
  const root = document.documentElement
  root.classList.toggle('dark', resolvedTheme === 'dark')
  root.style.colorScheme = resolvedTheme

  if (motionPreference === 'full') {
    root.dataset.reduceMotion = 'false'
  } else if (resolveReducedMotion(motionPreference, systemReduce)) {
    root.dataset.reduceMotion = 'true'
  } else {
    delete root.dataset.reduceMotion
  }
}

/** Inline bootstrap — keep in sync with resolve* helpers above. */
export const preferencesBootstrapScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}')||'system';var dark=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var root=document.documentElement;root.classList.toggle('dark',dark);root.style.colorScheme=dark?'dark':'light';var m=localStorage.getItem('${MOTION_STORAGE_KEY}')||'system';var sysReduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(m==='full')root.dataset.reduceMotion='false';else if(m==='reduce'||(m==='system'&&sysReduce))root.dataset.reduceMotion='true';else delete root.dataset.reduceMotion;}catch(e){}})();`
