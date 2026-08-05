<!-- pages/analytics/users.vue -->
<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import type { TimeFilter } from '~/types/analytics'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()
const activeFilter = ref<TimeFilter>('30d')

const userStats = computed(() => {
  const f = activeFilter.value
  const factor = f === '24h' ? 0.08 : f === '7d' ? 0.3 : f === '30d' ? 1 : 4.2

  return {
    newUsers: Math.round(1420 * factor),
    returningUsers: Math.round(8930 * factor),
    activeUsers: Math.round(12450 * (f === '24h' ? 0.5 : 1)),
    conversionRate: (3.8 * (f === '12m' ? 1.2 : 1)).toFixed(1)
  }
})

const locations = [
  { country: 'United States', code: 'US', share: '42%', count: '5,229' },
  { country: 'Germany', code: 'DE', share: '18%', count: '2,241' },
  { country: 'United Kingdom', code: 'UK', share: '14%', count: '1,743' },
  { country: 'Indonesia', code: 'ID', share: '12%', count: '1,494' },
  { country: 'Others', code: 'WW', share: '14%', count: '1,743' }
]


const tabs: { key: TimeFilter; label: string;}[] = [
  { key: '24h', label: '24H'},
  { key: '7d', label: '7D'},
  { key: '30d', label: '30D'},
  { key: '12m', label: '12M'}
]

const tabRefs = ref<HTMLElement[]>([])
const pillStyle = reactive({ left: '0px', width: '0px' })

const darkMode = ref()

const updatePill = () => {
  const index = tabs.findIndex((t) => t.key === activeTab.value)
  const currentEl = tabRefs.value[index]
  if (currentEl) {
    pillStyle.left = `${currentEl.offsetLeft}px`
    pillStyle.width = `${currentEl.offsetWidth}px`
  }
}

const activeTab = ref<TimeFilter>('7d')

watch(activeTab, () => {
  nextTick(() => updatePill())
})

// Fake pending
const pending = ref<boolean>(true)

onMounted(() => {
  nextTick(() => updatePill())
  window.addEventListener('resize', updatePill)
  setTimeout(() => {
    pending.value = false
  }, 500)
})

onUnmounted(() => {
  window.removeEventListener('resize', updatePill)
})

const chartTextColor = computed (() => {
  return {
    textColor: darkMode ? '#cbd5e1' : '#334155'
  }
})

// User Tier Distribution Chart Data
const tierChartData = computed(() => {
  const accent = settingsStore.activeAccentKey
  
  return{
    labels: ['Free Tier', 'Pro Plan', 'Enterprise'],
    datasets: [
      {
        data: [55, 30, 15],
        backgroundColor: [accent.lightHex, accent.secondaryHoverHex, accent.rgbaMain],
        borderWidth: 0
      }
    ]
  }
})

const tierChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { 
      labels: { 
        color: chartTextColor.value.textColor,
        font: { family: 'Inter, sans-serif', size: 12, weight: 'bold' as const }
      },
      position: 'right' as const 
    } 
  },
  Tooltip: {
    titleColor: chartTextColor.value.textColor,
    bodyColor: chartTextColor.value.textColor,
  }
}

</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-50">User Analytics</h1>
        <p class="text-sm text-slate-500 dark:text-slate-300">Demographics, retention, and conversion metrics.</p>
      </div>

      <!-- Sliding Horizontal Navigation Bar -->
        <div class="rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 p-1.5 shadow-xs">
          
          <!-- Tab Items -->
          <div class="relative flex overflow-x-auto no-scrollbar">
            <!-- Animated Active Pill Indicator -->
            <div
              class="absolute top-1.5 bottom-1.5 rounded-md bg-accent dark:bg-slate-800 border border-transparent dark:border-accent-border transition-all duration-300 ease-out"
              :style="[pillStyle]"
            />
            <button
              v-for="(tab, index) in tabs"
              :key="tab.key"
              :ref="(el) => (tabRefs[index] = el as HTMLElement)"
              @click="activeTab = tab.key"
              class="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 py-2.5 text-xs font-bold transition-colors z-10"
              :class="[activeTab === tab.key ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-50']"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
      </div>

    <!-- User Metrics Cards -->
    <div v-if="pending === true" class="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-38 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="New Users"
          :value="`$${(userStats?.newUsers ?? 0).toLocaleString()}`"
          :subtext='"First-time account registrations"'
          icon="heroicons:user-plus"
          trend="↑ 14%"
          trend-type="positive"
          use-accent-icon
        />

        <MetricCard
          title="Returning Users"
          :value="`${(userStats?.returningUsers ?? 0).toLocaleString()}`"
          :subtext='"30-day average"'
          icon="heroicons:arrow-path"
          trend="↑ 31%"
          trend-type="positive"
          use-accent-icon
        />

        <MetricCard
          title="Active Users"
          :value="`${(userStats?.activeUsers ?? 0).toLocaleString()}`"
          :subtext='"Active within platform"'
          icon="heroicons:bolt"
          trend="↑ 21%"
          trend-type="positive"
          use-accent-icon
        />

        <MetricCard
          title="Conversion Rate"
          :value="`${(userStats?.conversionRate ?? 0).toLocaleString()}`"
          :subtext='"Free-to-paid conversion"'
          icon="heroicons:funnel"
          trend="↑ 0.6%"
          trend-type="positive"
          use-accent-icon
        />
    </div>

    <!-- Charts & Location Split Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Tier Breakdown Doughnut -->
      <div class="rounded-2xl border border-slate-200 dark:border-accent-border bg-white dark:bg-slate-900 p-6 shadow-xs">
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-50 mb-4">User Tier Distribution</h2>
        <div class="h-56">
          <ClientOnly>
            <Doughnut :data="tierChartData" :options="tierChartOptions" />
          </ClientOnly>
        </div>
      </div>

      <!-- Location Distribution -->
      <div class="rounded-2xl border border-slate-200 dark:border-accent-border bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-50">User Location Breakdown</h2>
          <Icon name="heroicons:globe-alt" class="size-5 text-slate-400 dark:text-slate-300" />
        </div>
        <div class="space-y-3">
          <div v-for="loc in locations" :key="loc.code" class="space-y-1">
            <div class="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
              <span>{{ loc.country }} ({{ loc.code }})</span>
              <span class="font-semibold text-slate-900">{{ loc.count }} ({{ loc.share }})</span>
            </div>
            <div class="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                class="h-full rounded-full bg-blue-600"
                :style="{ width: loc.share }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>