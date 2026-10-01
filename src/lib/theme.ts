type ThemePreference = 'system' | 'dark' | 'light'

export function applyTheme(preference: ThemePreference) {
  if (typeof document === 'undefined') return preference
  try {
    localStorage.setItem('theme', preference)
  } catch {}
  const dark =
    preference === 'system'
      ? matchMedia('(prefers-color-scheme: dark)').matches
      : preference === 'dark'
  document.documentElement.classList.toggle('dark', dark)
  const button = document.querySelector<HTMLButtonElement>('#toggleDarkMode')
  if (button) button.dataset.theme = preference
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', dark ? '#0B0B10' : '#FCFCFD')
  return preference
}

export function cycleTheme() {
  const preferences: ThemePreference[] = ['system', 'dark', 'light']
  let current: string | null = null
  try {
    current = localStorage.getItem('theme')
  } catch {}
  const index = preferences.indexOf(current as ThemePreference)
  return applyTheme(preferences[(Math.max(index, 0) + 1) % preferences.length])
}

export function setTerminalTheme(mode: 'dark' | 'light' | 'toggle') {
  if (typeof document === 'undefined') return
  applyTheme(
    mode === 'toggle'
      ? document.documentElement.classList.contains('dark')
        ? 'light'
        : 'dark'
      : mode
  )
}
