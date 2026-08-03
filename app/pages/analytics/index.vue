<!-- pages/analytics/index.vue -->
<script setup lang="ts">
import { Line } from 'vue-chartjs'
import type { TimeFilter } from '~/types/analytics'
import type { ChartData, ChartOptions, ChartDataset } from 'chart.js'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()
const activeTab = ref<TimeFilter>('7d')

type LineDataset = ChartDataset<'line'>

// Reactive data mapped to active time filter
const { OverviewMetrics } = useAnalyticsApi()

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  // WIP: Intro Line Chart Animation
  // animations: {
  //   duration: 2000,
  //   easing: 'easeOutBounce'
  // },
  plugins: { legend: { display: true, position: 'top' as const } },
}

const tabs: { key: TimeFilter; label: string;}[] = [
  { key: '24h', label: '24H'},
  { key: '7d', label: '7D'},
  { key: '30d', label: '30D'},
  { key: '12m', label: '12M'}
]

const tabRefs = ref<HTMLElement[]>([])
const pillStyle = reactive({ left: '0px', width: '0px' })

const updatePill = () => {
  const index = tabs.findIndex((t) => t.key === activeTab.value)
  const currentEl = tabRefs.value[index]
  if (currentEl) {
    pillStyle.left = `${currentEl.offsetLeft}px`
    pillStyle.width = `${currentEl.offsetWidth}px`
  }
}

onMounted(() => {
  nextTick(() => updatePill())
  window.addEventListener('resize', updatePill)
})

onUnmounted(() => {
  window.removeEventListener('resize', updatePill)
})

watch(activeTab, () => {
  nextTick(() => updatePill())
})

const { data: overviewData, status } = await useAsyncData(
  'analytics-overview',
  () => OverviewMetrics(activeTab.value),
  {
    watch: [activeTab]
  }
)

// Default empty chart structure (Replaces null to fix Chart.js prop error)
const EMPTY_CHART_DATA: ChartData<'line'> = {
  labels: [],
  datasets: []
}

const lineChartData = computed<ChartData<'line'>>(() => {
  const chartData = overviewData.value?.chartData
  
  if (!chartData?.datasets || chartData.datasets.length < 2) return EMPTY_CHART_DATA

  const accent = settingsStore.activeAccentKey
  const [revenueRaw, growthRaw] = chartData.datasets

  const revenueDataset:LineDataset = {
    ...revenueRaw,
    label: 'Revenue',
    backgroundColor: accent.rgbaMain,
    hoverBackgroundColor: accent.hoverHex,
    fill: true,
    tension: 0.4,
    data: (revenueRaw?.data ?? []) as number[],
  }

  const growthDataset: LineDataset = {
    ...growthRaw,
    label: 'User Growth',
    backgroundColor: accent.secondaryHex,
    hoverBackgroundColor: accent.secondaryHoverHex,
    fill: true,
    tension: 0.4,
    data: (growthRaw?.data ?? []) as number[],
  }

  return {
    labels: chartData.labels ?? [],
    datasets: [revenueDataset, growthDataset],
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header & Filter Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Analytics Overview</h1>
        <p class="text-sm text-slate-500 dark:text-slate-300">Cross-metric performance overview and key drivers.</p>
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

      <div v-if="status === 'pending'" class="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-38 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>

      <div v-else-if="overviewData" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Revenue Trend"
          :value="`$${(overviewData?.mrr ?? 0).toLocaleString()}`"
          :subtext="(overviewData?.monthlyDiff ?? '')"
          icon="heroicons:arrow-trending-up"
          trend="↑ 12.5%"
          trend-type="positive"
          use-accent-icon
        />
  
        <MetricCard
          title="User Growth"
          :value="`${(overviewData?.userGrowth ?? 0)}%`"
          subtext="Active user expansion rate"
          icon="heroicons:user-group"
          trend="↑ 14.2%"
          trend-type="positive"
          use-accent-icon
        />
  
        <MetricCard
          title="Churn Rate"
          :value="(overviewData?.churnRate ?? 0)"
          subtext="Lowest in 6 months"
          icon="heroicons:user-minus"
          trend="↓ 0.4%"
          trend-type="positive"
          use-accent-icon
        />
  
        <MetricCard
          title="Monthly Comparison"
          :value="(overviewData?.momGrowth?? 0)"
          subtext="MoM growth multiple score"
          icon="heroicons:user-minus"
          trend="↑ 0.2%"
          trend-type="positive"
          use-accent-icon
        />
      </div>


    <!-- Main Overview Chart -->
    <div class="rounded-2xl border border-slate-200 dark:border-accent-border bg-white dark:bg-slate-800 p-6 shadow-xs">
      <h2 class="text-base font-semibold text-slate-900 dark:text-slate-50 mb-4">Overall Performance Trend</h2>
        <div class="h-64 w-full rounded-xl border border-dashed border-slate-20 dark:border-slate-200 bg-slate-50/50 dark:bg-slate-950/50 p-4">
        <ClientOnly>
          <Line 
            :data="lineChartData" 
            :options="chartOptions" 
          />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>