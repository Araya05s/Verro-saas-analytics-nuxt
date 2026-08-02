import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark' | 'system'
export type SidebarStyle = 'expanded' | 'collapsed' | 'compact'
export type AccentColor = 'green' | 'blue' | 'amber' | 'purple'

export interface CompanyProfile {
  companyName: string
  timezone: string
  currency: string
  language: string
}

export interface AccentColorOption {
  key: AccentColor
  name: string
  hex: string
  hoverHex: string
}

export const ACCENT_PALETTE: AccentColorOption[] = [
  { key: 'green', name: 'Emerald Green', hex: '#10B981', hoverHex: '#059669' },
  { key: 'blue', name: 'Ocean Blue', hex: '#3B82F6', hoverHex: '#2563EB' },
  { key: 'amber', name: 'Warm Amber', hex: '#F59E0B', hoverHex: '#D97706' },
  { key: 'purple', name: 'Royal Purple', hex: '#8B5CF6', hoverHex: '#7C3AED' }
]

export const useSettingsStore = defineStore('settings', () => {
  const profile = ref<CompanyProfile>({
    companyName: 'Acme Enterprise Solutions',
    timezone: 'UTC-5 (Eastern Time)',
    currency: 'USD ($)',
    language: 'English (US)'
  })

  const themeMode = ref<ThemeMode>('light')
  const sidebarStyle = ref<SidebarStyle>('expanded')
  const accentColor = ref<AccentColor>('green')

  const activeAccentHex = computed(() => {
    return ACCENT_PALETTE.find((c) => c.key === accentColor.value)?.hex || '#10B981'
  })

  const applyThemeToDOM = () => {
    if (!import.meta.client) return

    const root = document.documentElement

    root.classList.remove('dark')

    if (themeMode.value === 'dark') {
      root.classList.add('dark')
    } else if (themeMode.value === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        root.classList.add('dark')
      }
    }

    root.setAttribute('data-accent', accentColor.value)
  }

  const updateProfile = (partial: Partial<CompanyProfile>) => {
    profile.value = { ...profile.value, ...partial }
  }

  const setThemeMode = (mode: ThemeMode) => {
    themeMode.value = mode
    applyThemeToDOM()
  }

  const setSidebarStyle = (style: SidebarStyle) => {
    sidebarStyle.value = style
  }

  const setAccentColor = (color: AccentColor) => {
    accentColor.value = color
    applyThemeToDOM()
  }

  return {
    profile,
    themeMode,
    sidebarStyle,
    accentColor,
    activeAccentHex,
    updateProfile,
    setThemeMode,
    setSidebarStyle,
    setAccentColor,
    applyThemeToDOM
  }
})