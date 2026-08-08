import { defineStore } from 'pinia'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'

export type ThemeMode = 'light' | 'dark' | 'system'
export type SidebarStyle = 'expanded' | 'collapsed' | 'compact' | 'auto'
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
  lightHex: string
  borderHex: string

  // Chart-specific derived colors
  rgbaMain: string
  secondaryHex: string
  secondaryHoverHex: string
}

export const ACCENT_PALETTE: AccentColorOption[] = [
  { 
    key: 'green', 
    name: 'Emerald Green', 
    hex: '#10B981', 
    hoverHex: '#059669', 
    lightHex: '#ECFDF5', 
    borderHex: '#10B981',
    rgbaMain: 'rgba(16, 185, 129, 0.8)',
    secondaryHex: '#3B82F6',
    secondaryHoverHex: '#2563EB'
  },
  { 
    key: 'blue', 
    name: 'Ocean Blue', 
    hex: '#3B82F6', 
    hoverHex: '#2563EB', 
    lightHex: '#EFF6FF', 
    borderHex: '#3B82F6',
    rgbaMain: 'rgba(59, 130, 246, 0.8)',
    secondaryHex: '#8B5CF6',
    secondaryHoverHex: '#7C3AED'
  },
  { 
    key: 'amber', 
    name: 'Warm Amber', 
    hex: '#F59E0B', 
    hoverHex: '#D97706', 
    lightHex: '#FFFBEB', 
    borderHex: '#F59E0B',
    rgbaMain: 'rgba(245, 158, 11, 0.8)',
    secondaryHex: '#EF4444',
    secondaryHoverHex: '#DC2626'
  },
  { 
    key: 'purple', 
    name: 'Royal Purple', 
    hex: '#8B5CF6', 
    hoverHex: '#7C3AED', 
    lightHex: '#F5F3FF', 
    borderHex: '#8B5CF6',
    rgbaMain: 'rgba(139, 92, 246, 0.8)',
    secondaryHex: '#EC4899',
    secondaryHoverHex: '#DB2777'
  }]

export const useSettingsStore = defineStore('settings', () => {
  const profile = ref<CompanyProfile>({
    companyName: 'Acme Enterprise Solutions',
    timezone: 'UTC-5 (Eastern Time)',
    currency: 'USD ($)',
    language: 'English (US)'
  })

  const themeMode = ref<ThemeMode>('system')
  const sidebarStyle = ref<SidebarStyle>('expanded')
  const accentColor = ref<AccentColor>('green')

  const prefersDark = ref()

  const activeAccentKey = computed<AccentColorOption>(() => {
    const found = ACCENT_PALETTE.find(item => item.key === accentColor.value)
    return found ?? ACCENT_PALETTE[0]!
  })

  const applyThemeToDOM = () => {
    if (!import.meta.client) return

    const root = document.documentElement

    root.classList.remove('dark')

    if (themeMode.value === 'dark') {
      root.classList.add('dark')
    } else if (themeMode.value === 'system') {
      prefersDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark.value) {
        root.classList.add('dark')
      }
    }
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

  // Breakpoints to automatically adjust the sidebar style based on the tailwind's width
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isDesktop = breakpoints.greaterOrEqual('lg')
  const isTablet = breakpoints.between('sm', 'lg')

  watch(isTablet, (matches) => {
    if (matches) {
      sidebarStyle.value = 'compact'
    }
  }, { immediate: true })

  watch(isDesktop, (matches) => {
    if (matches) {
      sidebarStyle.value = 'expanded'
    }
  })

  return {
    profile,
    themeMode,
    prefersDark,
    sidebarStyle,
    accentColor,
    activeAccentKey,
    updateProfile,
    setThemeMode,
    setSidebarStyle,
    setAccentColor,
    applyThemeToDOM
  }
})