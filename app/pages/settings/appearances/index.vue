<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartData,
  type ChartOptions
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import { useSettingsStore, ACCENT_PALETTE, type SidebarStyle} from '~/stores/settings'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.applyThemeToDOM()
})

const previewChartData = computed<ChartData<'bar'>>(() => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [
    {
      label: 'Live Dynamic Metric',
      backgroundColor: settingsStore.activeAccentKey.hex,
      hoverBackgroundColor: settingsStore.activeAccentKey.hoverHex,
      borderRadius: 6,
      data: [45, 72, 58, 89, 63]
    }
  ]
}))

const previewChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: 'rgba(148, 163, 184, 0.1)' } }
  }
}
</script>

<template>
  <div class="space-y-6 max-w-4xl">
    <div>
      <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Appearance & Customization</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400">Configure visual themes, layout density, and chart color palettes.</p>
    </div>

    <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
      <div>
        <h2 class="text-base font-bold text-slate-900 dark:text-slate-50">Interface Theme</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400">Select how the portal renders on your display.</p>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <button
          @click="settingsStore.setThemeMode('light')"
          class="flex flex-col items-center gap-3 rounded-2xl border p-4 text-center"
          :class="[
            settingsStore.themeMode === 'light'
              ? 'border-accent-border bg-accent/5 ring-2 ring-accent/10 shadow-xs'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          ]"
        >
          <div class="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 shadow-xs">
            <Icon name="heroicons:sun-20-solid" class="size-6" />
          </div>
          <span class="text-xs font-bold text-slate-900 dark:text-slate-50">Light Mode</span>
        </button>

        <button
          @click="settingsStore.setThemeMode('dark')"
          class="flex flex-col items-center gap-3 rounded-2xl border p-4 text-center"
          :class="[
            settingsStore.themeMode === 'dark'
              ? 'border-accent-border bg-slate-500/20 ring-2 ring-accent/10 shadow-xs'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          ]"
        >
          <div class="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-slate-100 shadow-xs">
            <Icon name="heroicons:moon-20-solid" class="size-6" />
          </div>
          <span class="text-xs font-bold text-slate-900 dark:text-slate-50">Dark Mode</span>
        </button>

        <button
          @click="settingsStore.setThemeMode('system')"
          class="flex flex-col items-center gap-3 rounded-2xl border p-4 text-center"
          :class="[
            settingsStore.themeMode === 'system'
              ? 'border-accent-border bg-slate-500/20 ring-2 ring-accent/10 shadow-xs'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          ]"
        >
          <div class="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-xs">
            <Icon name="heroicons:computer-desktop-20-solid" class="size-6" />
          </div>
          <span class="text-xs font-bold text-slate-900 dark:text-slate-50">System Sync</span>
        </button>
      </div>
    </div>

    <div class="hidden md:flex flex-col visible rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
      <div>
        <h2 class="text-base font-bold text-slate-900 dark:text-slate-50">Sidebar Layout Style</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400">Choose navigation density according to your preference.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          v-for="style in ['expanded', 'collapsed', 'compact'] as SidebarStyle[]"
          :key="style"
          @click="settingsStore.setSidebarStyle(style)"
          class="flex items-center justify-between rounded-xl border p-4 text-xs font-bold capitalize transition-all"
          :class="[
            settingsStore.sidebarStyle === style
              ? 'border-accent-border bg-accent-50/20 text-accent ring-2 ring-accent/10'
              : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
          ]"
        >
          <span>{{ style }} Layout</span>
          <Icon v-if="settingsStore.sidebarStyle === style" name="heroicons:check-circle-20-solid" class="size-4 text-accent" />
        </button>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
      <div>
        <h2 class="text-base font-bold text-slate-900 dark:text-slate-50">Brand Accent & Chart Colors</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400">Dynamic theme color used across buttons, charts, and highlighted table cells.</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          v-for="color in ACCENT_PALETTE"
          :key="color.key"
          @click="settingsStore.setAccentColor(color.key)"
          class="flex items-center gap-3 rounded-2xl border p-3.5 transition-all text-left"
          :class="[
            settingsStore.accentColor === color.key
              ? 'border-slate-900 dark:border-slate-50 bg-slate-50 dark:bg-slate-800/80 shadow-xs'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
          ]"
        >
          <div class="size-6 rounded-full shadow-xs shrink-0" :style="{ backgroundColor: color.hex }" />
          <div>
            <span class="block text-xs font-bold text-slate-900 dark:text-slate-50">{{ color.name }}</span>
            <span class="block text-[10px] font-mono text-slate-400">{{ color.hex }}</span>
          </div>
        </button>
      </div>

      <div class="mt-6 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Real-time Interface Preview</span>
          <span
            class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-white font-bold bg-accent dark:bg-slate-900 hover:bg-accent-hover border border-transparent dark:border-accent-border">
            Active Theme
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div class="space-y-3">
            <p class="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Accent variables immediately recalculate across UI buttons, inputs, and analytical visuals.
            </p>
            <button
              class="w-full rounded-xl py-2.5 text-xs font-bold text-white shadow-xs bg-accent hover:bg-accent-hover dark:bg-accent/80"
            >
              Interactive Component Button
            </button>
          </div>

          <div class="h-28 rounded-xl bg-white dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-800">
            <Bar :data="previewChartData" :options="previewChartOptions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>