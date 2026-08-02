<!-- pages/analytics/revenue.vue -->
<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { TIME_FILTERS, type TimeFilter, type SalesTransaction } from '~/types/analytics'

const activeFilter = ref<TimeFilter>('30d')

// Interactive state logic: Filter -> Chart Updates -> Table Updates
const financialMetrics = computed(() => {
  const f = activeFilter.value
  const factor = f === '24h' ? 0.05 : f === '7d' ? 0.25 : f === '30d' ? 1 : 12

  return {
    mrr: Math.round(48250 * (f === '12m' ? 1 : factor)),
    arr: Math.round(579000 * (f === '12m' ? 1 : factor / 12)),
    monthlySales: Math.round(18400 * factor),
    subscriptionIncome: Math.round(29850 * factor)
  }
})

const chartData = computed(() => ({
  labels: ['W1', 'W2', 'W3', 'W4'],
  datasets: [
    {
      label: 'Subscription Income ($)',
      data: [8200, 9400, 11200, 13400].map((v) => Math.round(v * (activeFilter.value === '24h' ? 0.2 : 1))),
      backgroundColor: '#2563eb' // Blue secondary
    },
    {
      label: 'Expansion / Custom Sales ($)',
      data: [2100, 3100, 2800, 4200].map((v) => Math.round(v * (activeFilter.value === '24h' ? 0.2 : 1))),
      backgroundColor: '#f59e0b' // Yellow/Amber highlight
    }
  ]
}))

const transactions = computed<SalesTransaction[]>(() => {
  const filter = activeFilter.value
  const raw: SalesTransaction[] = [
    { id: 'TX-101', client: 'Acme Corp', plan: 'Enterprise Annual', amount: 12000, date: '2026-07-30', status: 'completed' },
    { id: 'TX-102', client: 'Starlight Media', plan: 'Pro Monthly', amount: 450, date: '2026-07-28', status: 'completed' },
    { id: 'TX-103', client: 'Nexus Tech', plan: 'Custom Tier', amount: 8500, date: '2026-07-25', status: 'completed' },
    { id: 'TX-104', client: 'Apex Solutions', plan: 'Pro Monthly', amount: 450, date: '2026-07-20', status: 'pending' }
  ]

  if (filter === '24h') return raw.slice(0, 1)
  if (filter === '7d') return raw.slice(0, 2)
  return raw
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: { x: { stacked: true }, y: { stacked: true } }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Revenue & Financials</h1>
        <p class="text-sm text-slate-500">Financial performance, recurring revenue, and ledger.</p>
      </div>

      <!-- Interaction Trigger: Filter -->
      <div class="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
        <button
          v-for="tf in TIME_FILTERS"
          :key="tf"
          @click="activeFilter = tf"
          class="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
          :class="[
            activeFilter === tf
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          ]"
        >
          {{ tf }}
        </button>
      </div>
    </div>

    <!-- Revenue Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- MRR -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div class="flex items-center justify-between gap-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">MRR</span>
          <div class="flex rounded-lg bg-blue-50 p-2 items-center justify-center text-blue-600">
            <Icon name="heroicons:currency-dollar" class="size-6" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between">
          <span class="text-3xl font-extrabold text-slate-900">${{ financialMetrics.mrr.toLocaleString() }}</span>
          <span class="inline-flex items-center text-xs font-semibold text-blue-600">↑ 8.4%</span>
        </div>
        <p class="mt-1 text-xs text-slate-400">Monthly Recurring Revenue</p>
      </div>

      <!-- ARR -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div class="flex items-center justify-between gap-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">ARR</span>
          <div class="flex rounded-lg bg-amber-50 p-2 items-center justify-center text-amber-500">
            <Icon name="heroicons:banknotes" class="size-6" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between">
          <span class="text-3xl font-extrabold text-slate-900">${{ financialMetrics.arr.toLocaleString() }}</span>
          <span class="inline-flex items-center text-xs font-semibold text-amber-600">Annualized</span>
        </div>
        <p class="mt-1 text-xs text-slate-400">Paced annualized run-rate</p>
      </div>

      <!-- Monthly Sales -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div class="flex items-center justify-between gap-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Monthly Sales</span>
          <div class="flex rounded-lg bg-blue-50 p-2 items-center justify-center text-blue-600">
            <Icon name="heroicons:shopping-cart" class="size-6" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between">
          <span class="text-3xl font-extrabold text-slate-900">${{ financialMetrics.monthlySales.toLocaleString() }}</span>
          <span class="inline-flex items-center text-xs font-semibold text-blue-600">New Deals</span>
        </div>
        <p class="mt-1 text-xs text-slate-400">New volume closed</p>
      </div>

      <!-- Subscription Income -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div class="flex items-center justify-between gap-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Sub Income</span>
          <div class="flex rounded-lg bg-amber-50 p-2 items-center justify-center text-amber-500">
            <Icon name="heroicons:credit-card" class="size-6" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between">
          <span class="text-3xl font-extrabold text-slate-900">${{ financialMetrics.subscriptionIncome.toLocaleString() }}</span>
          <span class="inline-flex items-center text-xs font-semibold text-amber-600">Automatic</span>
        </div>
        <p class="mt-1 text-xs text-slate-400">Stripe auto-collected</p>
      </div>
    </div>

    <!-- Interactive Component 1: Chart Updates -->
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      <h2 class="text-base font-semibold text-slate-900 mb-4">Revenue Stream Distribution</h2>
      <div class="h-64">
        <ClientOnly>
          <Bar :data="chartData" :options="chartOptions" />
        </ClientOnly>
      </div>
    </div>

    <!-- Interactive Component 2: Table Updates -->
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs overflow-hidden">
      <div class="mb-4">
        <h2 class="text-base font-semibold text-slate-900">Filtered Transactions</h2>
        <p class="text-xs text-slate-500">Live updating records matching filter: <span class="font-bold text-blue-600">{{ activeFilter }}</span></p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 text-slate-500 uppercase font-semibold">
            <tr>
              <th class="p-3">ID</th>
              <th class="p-3">Client</th>
              <th class="p-3">Plan</th>
              <th class="p-3">Amount</th>
              <th class="p-3">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr v-for="item in transactions" :key="item.id" class="hover:bg-slate-50">
              <td class="p-3 font-medium text-slate-900">{{ item.id }}</td>
              <td class="p-3">{{ item.client }}</td>
              <td class="p-3">{{ item.plan }}</td>
              <td class="p-3 font-semibold text-slate-900">${{ item.amount.toLocaleString() }}</td>
              <td class="p-3">
                <span
                  class="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  :class="item.status === 'completed' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-700'"
                >
                  {{ item.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>