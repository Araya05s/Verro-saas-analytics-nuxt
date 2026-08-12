<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  type ChartData,
  type ChartOptions
} from 'chart.js'
import { Bar, Line, Doughnut } from 'vue-chartjs'
import * as XLSX from 'xlsx'
import { useReportsStore } from '~/stores/reports'
import TableData, { type Column } from '~/components/tableData.vue'
import AppModal from '~/components/appModal.vue'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement
)

const reportsStore = useReportsStore()

type TabKey = 'revenue' | 'users' | 'billing' | 'growth'
const activeTab = ref<TabKey>('revenue')

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'revenue', label: 'Revenue Report', icon: 'heroicons:currency-dollar-20-solid' },
  { key: 'users', label: 'User Report', icon: 'heroicons:users-20-solid' },
  { key: 'billing', label: 'Billing Report', icon: 'heroicons:credit-card-20-solid' },
  { key: 'growth', label: 'Growth Report', icon: 'heroicons:arrow-trending-up-20-solid' }
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

const darkMode = ref()

onMounted(() => {
  darkMode.value = settingsStore.prefersDark
  nextTick(() => updatePill())
  window.addEventListener('resize', updatePill)
})

onUnmounted(() => {
  window.removeEventListener('resize', updatePill)
})

watch(activeTab, () => {
  nextTick(() => updatePill())
})

const chartTextColor = computed (() => {
  return {
    textColor: darkMode.value ? '#cbd5e1' : '#334155'
  }
})

const GREEN = '#10B981'
const YELLOW = '#F59E0B'

const revenueChartData= computed(() => {
  const accent = settingsStore.activeAccentKey

  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Recurring Revenue ($)',
        backgroundColor: accent.rgbaMain,
        borderRadius: 8,
        data: [32000, 38000, 42000, 45000, 51000, 59000, 68000]
      },
      {
        label: 'Expansion Revenue ($)',
        backgroundColor: accent.secondaryHex,
        borderRadius: 8,
        data: [5000, 7000, 6500, 9000, 11000, 14000, 18000]
      }
    ]
  }
})

const userChartData= computed(() => {
  const accent = settingsStore.activeAccentKey

  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Active Users',
        borderColor: accent.hoverHex,
        backgroundColor: accent.rgbaMain,
        borderWidth: 3,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: accent.hoverHex,
        data: [1200, 1900, 2400, 3100, 4200, 5800, 7400]
      },
      {
        label: 'Paid Subscribers',
        borderColor: accent.secondaryHoverHex,
        backgroundColor: accent.secondaryHex,
        borderWidth: 3,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: accent.secondaryHoverHex,
        data: [400, 650, 910, 1200, 1850, 2600, 3400]
      }
    ]
  }
})

const billingChartData= computed(() => {
  const accent = settingsStore.activeAccentKey

  return {
    labels: ['Paid Invoices', 'Pending Payments', 'Overdue Statements'],
    datasets: [
      {
        backgroundColor: [GREEN, YELLOW, '#EF4444'],
        hoverOffset: 6,
        
        borderColor: accent.lightHex,
        data: [65, 25, 10]
      }
    ]
  }
})

const growthChartData: ChartData<'bar'> = {
  labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'],
  datasets: [
    {
      label: 'MoM Growth Rate (%)',
      backgroundColor: YELLOW,
      borderRadius: 8,
      data: [12, 18, 15, 22, 28, 34]
    }
  ]
}


// Chart options for each different chart types
const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { 
        color: chartTextColor.value.textColor,
        font: { family: 'Inter, sans-serif', size: 12, weight: 'bold' as const }
       }
    }
  },
  Tooltip: {
    titleColor: chartTextColor.value.textColor,
    bodyColor: chartTextColor.value.textColor,
  }
}

const lineChartOptions: ChartOptions<'line'> = {
  ...baseChartOptions,
  scales: {
    x: {
      ticks: {
        color: chartTextColor.value.textColor
      },
    },
    y: { 
      ticks: {
        color: chartTextColor.value.textColor
      },
      grid: {
        color: chartTextColor.value.textColor
      },
      beginAtZero: true 
    }
  }
}

const barChartOptions: ChartOptions<'bar'> = {
  ...baseChartOptions,
  scales: {
    x: {
      ticks: {
        color: chartTextColor.value.textColor
      },
    },
    y: { 
      ticks: {
        color: chartTextColor.value.textColor
      },
      grid: {
        color: chartTextColor.value.textColor
      }
     }
  }
}

const doughnutChartOptions: ChartOptions<'doughnut'> = {
  ...baseChartOptions
}

interface RevenueRow {
  id: string
  period: string
  mrr: number
  arr: number
  growth: string
}

const revenueColumns: Column<RevenueRow>[] = [
  { key: 'period', label: 'Period', sortable: true, formatter: (val) => val },
  { key: 'mrr', label: 'MRR ($)', sortable: true, formatter: (val) => `$${Number(val).toLocaleString()}` },
  { key: 'arr', label: 'ARR ($)', sortable: true, formatter: (val) => `$${Number(val).toLocaleString()}` },
  { key: 'growth', label: 'Growth Rate', sortable: true, formatter: (val) => val }
]

const revenueTableData = ref<RevenueRow[]>([
  { id: '1', period: 'July 2026', mrr: 68000, arr: 816000, growth: '+15.2%' },
  { id: '2', period: 'June 2026', mrr: 59000, arr: 708000, growth: '+15.6%' },
  { id: '3', period: 'May 2026', mrr: 51000, arr: 612000, growth: '+13.3%' },
  { id: '4', period: 'April 2026', mrr: 45000, arr: 540000, growth: '+7.1%' }
])

// --- Excel data simulation ---
const isExportModalOpen = ref(false)
const exportProgress = ref(0)
const isExporting = ref(false)

const triggerExcelExport = () => {
  isExportModalOpen.value = true
  isExporting.value = true
  exportProgress.value = 0

  const interval = setInterval(() => {
    exportProgress.value += 10
    if (exportProgress.value >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        generateAndDownloadExcel()
        isExporting.value = false
      }, 300)
    }
  }, 120)
}

const generateAndDownloadExcel = () => {
  const summarySheetData = [
    { Metric: 'Active Subscriptions Tier', Value: 'Professional' },
    { Metric: 'Current Monthly Recurring Revenue (MRR)', Value: '$68,000' },
    { Metric: 'Annual Recurring Revenue (ARR)', Value: '$816,000' },
    { Metric: 'Total Registered Users', Value: '7,400' }
  ]

  const revenueSheetData = revenueTableData.value.map((r) => ({
    Period: r.period,
    'MRR ($)': r.mrr,
    'ARR ($)': r.arr,
    'Growth Rate': r.growth
  }))

  const workbook = XLSX.utils.book_new()
  const wbSummary = XLSX.utils.json_to_sheet(summarySheetData)
  const wbRevenue = XLSX.utils.json_to_sheet(revenueSheetData)

  XLSX.utils.book_append_sheet(workbook, wbSummary, 'Executive Summary')
  XLSX.utils.book_append_sheet(workbook, wbRevenue, 'Revenue Breakdown')

  const filename = `Executive_Report_${activeTab.value.toUpperCase()}_2026.xlsx`
  XLSX.writeFile(workbook, filename)

  reportsStore.addExportRecord({
    filename,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    type:
      activeTab.value === 'revenue'
        ? 'Revenue'
        : activeTab.value === 'users'
          ? 'User Growth'
          : activeTab.value === 'billing'
            ? 'Billing Summary'
            : 'Growth KPIs',
    size: '18.4 KB'
  })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Excel Export Button -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Executive Reports</h1>
        <p class="text-sm text-slate-500 dark:text-slate-300">Cross-departmental performance metrics and financial summaries.</p>
      </div>

      <button
        @click="triggerExcelExport"
        class="inline-flex items-center gap-2 rounded-xl bg-accent dark:bg-accent/10 px-4 py-2.5 text-xs font-bold text-slate-50 shadow-xs hover:bg-accent/80 dark:hover:bg-accent/20 active:scale-95 transition-all border border-transparent dark:border-accent-border"
      >
        <Icon name="heroicons:document-arrow-down-20-solid" class="size-4" />
        Export to Excel
      </button>
    </div>

    <!-- Sliding Horizontal Navigation Bar -->
    <div class="w-full rounded-2xl border border-slate-200 dark:border-accent-border bg-white dark:bg-accent/5 px-2 shadow-xs">
      
      <!-- Tab Items -->
      <div class="relative flex flex-col lg:flex-row overflow-x-auto no-scrollbar">
        <!-- Animated Active Pill Indicator -->
        <div
          class="hidden lg:flex absolute top-1.5 bottom-1.5 rounded-lg bg-accent dark:bg-accent/20 border border-accent-border transition-all duration-300 ease-out"
          :style="pillStyle"
        />
        <button
          v-for="(tab, index) in tabs"
          :key="tab.key"
          :ref="(el) => (tabRefs[index] = el as HTMLElement)"
          @click="activeTab = tab.key"
          class="flex items-center justify-center gap-2 whitespace-nowrap px-5 py-2 lg:py-4 text-xs font-bold transition-colors z-10 rounded-xl lg:rounded-none border-b lg:border-transparent"
          :class="[activeTab === tab.key ? 'text-slate-50 border-accent-light' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-accent/50']"
        >
          <Icon :name="tab.icon" class="size-4" />
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div v-if="activeTab === 'revenue'" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-accent-border bg-white dark:bg-accent/10 p-6 shadow-xs">
          <h2 class="text-base font-bold text-slate-900 dark:text-slate-50 mb-1">Monthly Revenue Velocity</h2>
          <p class="text-xs text-slate-500 dark:text-slate-300 mb-6">Comparison between recurring subscriptions and add-on expansions.</p>
          <div class="h-64 w-full rounded-xl border border-dashed border-slate-20 dark:border-slate-200 bg-slate-50/50 dark:bg-slate-950/50 p-4">
            <Bar :data="revenueChartData" :options="barChartOptions" />
          </div>
        </div>

        <div class="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-accent-border bg-white dark:bg-accent/10 p-6 shadow-xs">
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-slate-50  mb-2">Executive Summary</h2>
            <div class="my-4 border-t border-slate-100 dark:border-accent-border"></div>
            <div class="space-y-4 text-xs">
              <div>
                <span class="text-slate-400 dark:text-slate-100 block font-semibold">Total ARR</span>
                <p class="text-2xl font-extrabold text-slate-900 dark:text-slate-50 ">$816,000</p>
                <span class="text-[11px] font-bold text-accent">▲ +18.4% vs last quarter</span>
              </div>
              <div>
                <span class="text-slate-400 block font-semibold">Average Revenue Per User (ARPU)</span>
                <p class="text-lg font-bold text-slate-800 dark:text-slate-200 ">$185.50 / mo</p>
              </div>
            </div>
          </div>

          <div class="mt-6 rounded-xl bg-emerald-50/50 dark:bg-accent/20 p-3.5 border border-accent-light/60 text-xs text-accent-dark dark:text-accent-light">
            <strong>Insight:</strong> Professional tier upgrades contributed to 68% of new expansion revenue in Q2.
          </div>
        </div>
      </div>

      <TableData :columns="revenueColumns" :data="revenueTableData" :page-size-options="[5, 10]" />
      
    </div>

    <div v-else-if="activeTab === 'users'" class="space-y-6">
      <div class="rounded-2xl border dark:border-accent-border bg-white dark:bg-accent/10 p-6 box-border shadow-xs">
        <h2 class="text-base font-bold text-slate-900 dark:text-slate-50 mb-1">User Growth & Conversion</h2>
        <p class="text-xs text-slate-500 dark:text-slate-300 mb-6">Tracking active accounts versus paying subscribers.</p>
        <div class="h-64 w-auto rounded-xl border border-dashed border-slate-20 dark:border-slate-200 bg-slate-50/50 dark:bg-slate-950/50 p-4">
          <Line :data="userChartData" :options="lineChartOptions" />
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'billing'" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div class="rounded-2xl border dark:border-accent-border bg-white dark:bg-accent/10 p-6 shadow-xs">
          <h2 class="text-base font-bold text-slate-900 dark:text-slate-50 mb-1">Invoice Status Distribution</h2>
          <p class="text-xs text-slate-500 dark:text-slate-300 mb-6">Breakdown of current billing collection efficiency.</p>
          <div class="h-64 flex justify-center">
            <Doughnut :data="billingChartData" :options="doughnutChartOptions" />
          </div>
        </div>

        <div class="space-y-4">
          <div class="rounded-2xl border dark:border-accent-border bg-white dark:bg-accent/10 p-5 shadow-xs flex items-center justify-between">
            <div>
              <span class="text-xs text-slate-400 dark:text-slate-200 font-bold block">COLLECTED THIS MONTH</span>
              <span class="text-xl font-extrabold text-accent">$68,400.00</span>
            </div>
            <div class="size-10 rounded-xl bg-accent-light dark:bg-accent/10 flex items-center justify-center text-accent border border-transparent dark:border-accent-border">
              <Icon name="heroicons:check-circle-20-solid" class="size-6" />
            </div>
          </div>

          <div class="rounded-2xl border dark:border-accent-border bg-white dark:bg-accent/10 p-5 shadow-xs flex items-center justify-between">
            <div>
              <span class="text-xs text-slate-400 dark:text-slate-200 font-bold block">PENDING INVOICES</span>
              <span class="text-xl font-extrabold text-amber-600">$12,500.00</span>
            </div>
            <div class="size-10 rounded-xl bg-amber-50 dark:bg-amber-600/10 flex items-center justify-center text-amber-600 border border-transparent dark:border-amber-600">
              <Icon name="heroicons:clock-20-solid" class="size-6" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'growth'" class="space-y-6">
      <div class="rounded-2xl border dark:border-accent-border bg-white dark:bg-accent/10 p-6 shadow-xs">
        <h2 class="text-base font-bold text-slate-900 dark:text-slate-50 mb-1">Quarterly Growth Velocity (%)</h2>
        <p class="text-xs text-slate-500 dark:text-slate-200 mb-6">Quarter-over-quarter account expansion rate.</p>
        <div class="h-80">
          <Bar :data="growthChartData" :options="barChartOptions" />
        </div>
      </div>
    </div>

    <AppModal v-model="isExportModalOpen" max-width="sm">
      <template #header>
        <div class="flex items-center gap-2">
          <div class="size-8 rounded-lg bg-accent-light dark:bg-accent/10 flex items-center justify-center text-accent border border-transparent dark:border-accent-border">
            <Icon name="heroicons:document-text-20-solid" class="size-5" />
          </div>
          <h3 class="text-sm font-bold text-slate-900 dark:text-slate-50">Generating Excel File</h3>
        </div>
      </template>

      <div class="py-4 space-y-4">
        <p class="text-xs text-slate-500 dark:text-slate-300">Compiling financial metrics and datasets into XLSX workbook format...</p>

        <div class="space-y-1.5">
          <div class="flex justify-between text-[11px] font-bold">
            <span class="text-slate-600 dark:text-slate-200">{{ isExporting ? 'Building Sheets...' : 'Completed!' }}</span>
            <span class="text-accent font-mono">{{ exportProgress }}%</span>
          </div>
          <div class="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              class="h-full bg-accent transition-all duration-150 ease-out"
              :style="{ width: `${exportProgress}%` }"
            />
          </div>
        </div>
      </div>

      <template #footer="{ close }">
        <button
          @click="close"
          :disabled="isExporting"
          class="rounded-xl border border-accent-border px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-accent/20 disabled:opacity-40"
        >
          {{ isExporting ? 'Processing...' : 'Close' }}
        </button>
      </template>
    </AppModal>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>