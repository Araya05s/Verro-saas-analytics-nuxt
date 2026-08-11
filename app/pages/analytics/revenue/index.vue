<!-- pages/analytics/revenue.vue -->
<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { type TimeFilter, type SalesTransaction } from '~/types/analytics'
import { useBillingStore, type Invoice } from '~/stores/billing'
import TableData, { type Column } from '~/components/tableData.vue'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()
const searchQuery = ref('')
const billingStore = useBillingStore()

// Interactive state logic: Filter -> Chart Updates -> Table Updates
const financialMetrics = computed(() => {
  const f = activeTab.value
  const factor = f === '24h' ? 0.05 : f === '7d' ? 0.25 : f === '30d' ? 1 : 12

  return {
    mrr: Math.round(48250 * (f === '12m' ? 1 : factor)),
    arr: Math.round(579000 * (f === '12m' ? 1 : factor / 12)),
    monthlySales: Math.round(18400 * factor),
    subscriptionIncome: Math.round(29850 * factor)
  }
})

const columns: Column<Invoice>[] = [
  { key: 'id', label: 'Invoice ID', sortable: true },
  { key: 'client', label: 'Client', sortable: true },
  { key: 'plan', label: 'Plan', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
]
const query = searchQuery.value.trim().toLowerCase()

const filteredRevenues = computed(() => {

  return billingStore.invoices
  .map((inv) => {
    const plan = inv.items?.[0]?.description ?? 'Unknown'
    const formattedAmount = new Intl.NumberFormat('en-us', {
      style: 'currency',
      currency: 'USD'
    }).format(inv.amount)

    return {
        ...inv,
        plan,
        formattedAmount,
      }

  }).filter(
    (inv) =>
      inv.id.toLowerCase().includes(query) ||
      inv.client.toLowerCase().includes(query) ||
      inv.status.toLowerCase().includes(query) ||
      inv.plan.toLowerCase().includes(query)
  )
})

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

const activeTab = ref<TimeFilter>('7d')

const darkMode = ref()

watch(activeTab, () => {
  nextTick(() => updatePill())
})

const chartTextColor = computed (() => {
  return {
    textColor: darkMode ? '#cbd5e1' : '#334155'
  }
})

const chartData = computed(() => {
  // const currentData = mockDataByTimeframe[activeTab.value]
  const accent = settingsStore.activeAccentKey

  return {
    labels: ['W1', 'W2', 'W3', 'W4'],
    datasets: [
      {
        label: 'Subscription Income ($)',
        data: [8200, 9400, 11200, 13400].map((v) => Math.round(v * (activeTab.value === '24h' ? 0.2 : 1))),
        backgroundColor: accent.rgbaMain
      },
      {
        label: 'Expansion / Custom Sales ($)',
        data: [2100, 3100, 2800, 4200].map((v) => Math.round(v * (activeTab.value === '24h' ? 0.2 : 1))),
        backgroundColor: accent.secondaryHex
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { 
      labels: { 
        color: chartTextColor.value.textColor,
        font: { family: 'Inter, sans-serif', size: 12, weight: 'bold' as const }
      },
      position: 'top' as const 
    } 
  },
  Tooltip: {
    titleColor: chartTextColor.value.textColor,
    bodyColor: chartTextColor.value.textColor,
  },
  scales: {
    x: {
      ticks: {
        color: chartTextColor.value.textColor
      },
      stacked: true,
      grid: { display: false }
    },
    y: {
      ticks: {
        color: chartTextColor.value.textColor,
      },
      grid: {
        color: chartTextColor.value.textColor
      },
      stacked: true,
    }
  }
}

// Fake pending
const pending = ref<boolean>(true)

onMounted(() => {
  nextTick(() => updatePill())
  darkMode.value = settingsStore.prefersDark
  window.addEventListener('resize', updatePill)
  setTimeout(() => {
    pending.value = false
  }, 500)
})

onUnmounted(() => {
  window.removeEventListener('resize', updatePill)
})

// const formatCurrency = (val: unknown): string => {
//   return typeof val === 'number' ? val.toLocaleString() : String(val ?? '')
// }
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Revenue & Financials</h1>
        <p class="text-sm text-slate-500  dark:text-slate-300">Financial performance, recurring revenue, and ledger.</p>
      </div>

      <!-- Sliding Horizontal Navigation Bar -->
        <div class="max-w-65 md:max-w-7xl rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 p-1.5 shadow-xs">
          
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

    <!-- Revenue Metric Cards -->
    <div v-if="pending === true" class="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-38 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="MRR"
          :value="`$${(financialMetrics?.mrr ?? 0).toLocaleString()}`"
          :subtext='"Monthly Recurring Revenue"'
          icon="heroicons:currency-dollar"
          trend="↑ 8.4%"
          trend-type="positive"
          use-accent-icon
        />

        <MetricCard
          title="ARR"
          :value="`$${(financialMetrics?.arr ?? 0).toLocaleString()}`"
          :subtext='"Paced annualized run-rate"'
          icon="heroicons:banknotes"
          trend="Annualized"
          trend-type="positive"
          use-accent-icon
        />

        <MetricCard
          title="Monthly Sales"
          :value="`$${(financialMetrics?.monthlySales ?? 0).toLocaleString()}`"
          :subtext='"New volume closed"'
          icon="heroicons:shopping-cart"
          trend="New Deals"
          trend-type="positive"
          use-accent-icon
        />

        <MetricCard
          title="Sub Income"
          :value="`$${(financialMetrics?.subscriptionIncome ?? 0).toLocaleString()}`"
          :subtext='"Stripe auto-collected"'
          icon="heroicons:credit-card"
          trend="Automatic"
          trend-type="positive"
          use-accent-icon
        />
    </div>

    <div class="grid grid-cols-1 gap-8">
      <div class="rounded-2xl border border-slate-200 dark:border-accent-border bg-white dark:bg-slate-800 p-6 shadow-xs">
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-50 mb-4">Revenue Stream Distribution</h2>
         <div class="relative h-64 w-full min-w-0 rounded-xl border border-dashed border-slate-200 dark:border-slate-200 bg-slate-50/50 dark:bg-slate-950/50 p-4">
            <ClientOnly>
              <Bar :data="chartData" :options="chartOptions" />
            </ClientOnly>
        </div>
      </div>
      <div class="rounded-2xl border border-slate-200 dark:border-accent-border bg-white dark:bg-accent/5 p-6 shadow-xs overflow-hidden">
        <div class="mb-4">
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-50">Filtered Transactions</h2>
          <p class="text-xs text-slate-500 dark:text-slate-300">Live updating records matching filter: <span class="font-bold text-accent">{{ activeTab }}</span></p>
        </div>
        <TableData
          :columns="columns"
          :data="filteredRevenues"
          :page-size-options="[5, 10, 20, 50]"
        >
          <template #cell-id="{ value }">
            <span class="font-mono font-bold text-slate-900 dark:text-slate-50 group-hover:text-accent transition-colors">
              {{ value }}
            </span>
          </template>
  
          <template #cell-amount="{ value }">
            <span class="font-extrabold text-slate-900 dark:text-accent">${{ value }}</span>
          </template>
  
          <template #cell-status="{ value }">
            <span
              class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold"
              :class="{
                'bg-emerald-50 text-emerald-600': value === 'Paid',
                'bg-amber-50 text-amber-700': value === 'Pending',
                'bg-red-50 text-red-600': value === 'Overdue'
              }"
            >
              {{ value }}
            </span>
          </template>
        </TableData>
      </div>
    </div>
  </div>
</template>