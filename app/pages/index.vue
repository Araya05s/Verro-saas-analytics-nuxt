<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
)

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      grid: { display: false }
    },
    y: {
      stacked: true,
      grid: {
        color: '#515559'
      },
      ticks: { display: false }
    }
  }
})

type timeFilterKey = '24h' | '7d' | '30d' | '12m'
const activeTab = ref<timeFilterKey>('7d')

const mockDataByTimeframe: Record<timeFilterKey, { labels: string[]; gross: number[]; net: number[] }> = {
  '24h': {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    gross: [12, 18, 45, 60, 35, 25],
    net: [8, 12, 30, 40, 20, 15]
  },
  '7d': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    gross: [40, 55, 70, 65, 85, 95, 110],
    net: [30, 45, 60, 50, 75, 85, 90]
  },
  '30d': {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    gross: [280, 320, 410, 450],
    net: [200, 240, 310, 330]
  },
  '12m': {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    gross: [1200, 1400, 1100, 1700, 2100, 2400, 2200, 2600, 2800, 3100, 3500, 3900],
    net: [900, 1000, 800, 1300, 1600, 1800, 1700, 2000, 2100, 2300, 2700, 3000]
  }
}

const chartData = computed(() => {
  const currentData = mockDataByTimeframe[activeTab.value]
  const accent = settingsStore.activeAccentKey

  return {
    labels: currentData.labels,
    datasets: [
      {
        label: 'Gross',
        backgroundColor: accent.rgbaMain,
        hoverBackgroundColor: accent.hoverHex,
        borderRadius: { topLeft: 6, topRight: 6 },
        data: currentData.gross
      },
      {
        label: 'Net',
        backgroundColor: accent.secondaryHex,
        hoverBackgroundColor: accent.secondaryHoverHex,
        borderRadius: { topLeft: 6, topRight: 6 },
        data: currentData.net
      }
    ]
  }
})

const tabs: { key: timeFilterKey; label: string;}[] = [
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

onMounted(() => {
  settingsStore.applyThemeToDOM()
})
</script>

<template>
      <div class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Overview</h1>
          <p class="text-sm text-slate-500 dark:text-slate-300">Monitor your key SaaS metrics and customer growth.</p>
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

      <div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        <!-- Metric Card 1 -->
        <MetricCard
          title="Monthly Recurring Revenue"
          value="$48,250"
          subtext="vs. last month ($42,880)"
          icon="heroicons:currency-dollar"
          trend="↑ 12.5%"
          trend-type="positive"
          use-accent-icon
        />

        <!-- Metric Card 2 (Blue Highlight Card) -->
        <MetricCard
          title="Active Subscribers"
          value="1,420"
          subtext="Target: 1,500 by month-end"
          icon="heroicons:users"
          variant-class="border-blue-100 dark:border-blue-900 bg-linear-to-br from-white dark:from-blue-800 to-blue-50/30 dark:to-blue-900/30"
          title-class="text-blue-600 dark:text-slate-300"
          icon-container-class="bg-blue-100 dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-transparent dark:border-blue-500"
        >
          <template #trend>
            <span class="inline-flex items-center rounded-md bg-blue-100 dark:bg-slate-900 px-2 py-0.5 text-xs font-semibold text-emerald-500 border border-transparent dark:border-blue-200">
              +184 new
            </span>
          </template>
        </MetricCard>

        <!-- Metric Card 3 -->
        <MetricCard
          title="Churn Rate"
          value="1.8%"
          subtext="Lowest in 6 months"
          icon="heroicons:arrow-trending-up"
          trend="↓ 0.4%"
          trend-type="positive"
          use-accent-icon
        />

        <!-- Metric Card 4 -->
         <MetricCard
          title="Avg Revenue Per Use"
          value="$33.98"
          subtext="Driven by Pro Plan upgrades"
          icon="heroicons:chart-bar"
          trend="↑ 3.1%"
          trend-type="positive"
          use-accent-icon
        />
      </div>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs lg:col-span-2">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-slate-200">Revenue Growth</h2>
              <p class="text-xs text-slate-500">Gross revenue vs Net revenue trajectory</p>
            </div>
          </div>
          
          <!-- Chart Mockup Data -->
          <div class="h-64 w-full rounded-xl border border-dashed border-slate-20 dark:border-slate-200 bg-slate-50/50 dark:bg-slate-950/50 p-4">
            <Bar :data="chartData" :options="chartOptions" />
          </div>
        </div>

        <div class="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <div>
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-lg font-bold text-slate-900 dark:text-slate-200">Live Activity</h2>
            </div>

            <!-- Activity List -->
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="mt-0.5 rounded-full bg-blue-100 p-1.5 text-blue-600">
                  ⚡
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-800 dark:text-slate-50">New Enterprise Upgrade</p>
                  <p class="text-xs text-slate-500">Acme Corp upgraded to $299/mo plan</p>
                  <span class="text-[10px] text-slate-400 dark:text-slate-300">2 minutes ago</span>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <div class="mt-0.5 rounded-full bg-emerald-100 p-1.5 text-emerald-600">
                  👤
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-800 dark:text-slate-50">New User Sign Up</p>
                  <p class="text-xs text-slate-500">dev_sarah@example.com</p>
                  <span class="text-[10px] text-slate-400 dark:text-slate-300">14 minutes ago</span>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <div class="mt-0.5 rounded-full bg-emerald-100 p-1.5 text-emerald-600">
                  💳
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-800 dark:text-slate-50">Subscription Renewed</p>
                  <p class="text-xs text-slate-500">Pro Tier ($49.00)</p>
                  <span class="text-[10px] text-slate-400 dark:text-slate-300">1 hour ago</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Blue CTA Callout at bottom -->
          <div class="mt-6 rounded-xl bg-blue-50/80 dark:bg-slate-900/80 p-4 border-b border-blue-100 dark:border-blue-800">
            <p class="text-xs font-bold text-blue-900 dark:text-blue-200">Need advanced attribution?</p>
            <p class="mt-1 text-xs text-blue-700 dark:text-blue-300">Connect Google Analytics or Segment integrations.</p>
            <a href="#" class="mt-3 inline-block text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">Configure Integrations →</a>
          </div>
        </div>
      </div>
</template>