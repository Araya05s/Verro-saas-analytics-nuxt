<!-- pages/analytics/index.vue -->
<script setup lang="ts">
import type { Animations } from 'chart.js'
import { Line } from 'vue-chartjs'
import { TIME_FILTERS, type TimeFilter } from '~/types/analytics'

const activeFilter = ref<TimeFilter>('30d')

// Reactive data mapped to active time filter
const overviewData = computed(() => {
  const filter = activeFilter.value
  const multiplier = filter === '24h' ? 0.1 : filter === '7d' ? 0.3 : filter === '30d' ? 1 : 3.5

  return {
    mrr: Math.round(48250 * multiplier),
    userGrowth: (14.2 * (filter === '24h' ? 0.2 : 1)).toFixed(1),
    churnRate: filter === '12m' ? '1.8%' : '2.1%',
    monthlyDiff: '+$5,370 vs previous period',
    chartData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue Trend ($)',
          data: [12000, 19000, 27000, 34000, 41000, 48250].map((v) => Math.round(v * multiplier)),
          borderColor: '#2563eb', // Blue secondary
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'User Growth',
          data: [1100, 1450, 1900, 2400, 2850, 3420].map((v) => Math.round(v * multiplier)),
          borderColor: '#eab308', // Yellow highlight
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.4
        }
      ]
    }
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  // WIP: Intro Line Chart Animation
  // animations: {
  //   duration: 2000,
  //   easing: 'easeOutBounce'
  // },
  plugins: { legend: { display: true, position: 'top' as const } },
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header & Filter Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Analytics Overview</h1>
        <p class="text-sm text-slate-500">Cross-metric performance overview and key drivers.</p>
      </div>

      <!-- Time Filter Component -->
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

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div class="flex items-center justify-between gap-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Revenue Trend</span>
          <div class="flex rounded-lg bg-blue-50 p-2 items-center justify-center text-blue-600">
            <Icon name="heroicons:arrow-trending-up" class="size-6" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between">
          <span class="text-3xl font-extrabold text-slate-900">${{ overviewData.mrr.toLocaleString() }}</span>
          <span class="inline-flex items-center text-xs font-semibold text-blue-600">↑ 12.5%</span>
        </div>
        <p class="mt-1 text-xs text-slate-400">{{ overviewData.monthlyDiff }}</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div class="flex items-center justify-between gap-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">User Growth</span>
          <div class="flex rounded-lg bg-amber-50 p-2 items-center justify-center text-amber-500">
            <Icon name="heroicons:user-group" class="size-6" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between">
          <span class="text-3xl font-extrabold text-slate-900">+{{ overviewData.userGrowth }}%</span>
          <span class="inline-flex items-center text-xs font-semibold text-amber-600">★ Highlight</span>
        </div>
        <p class="mt-1 text-xs text-slate-400">Active active user expansion rate</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div class="flex items-center justify-between gap-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Churn Rate</span>
          <div class="flex rounded-lg bg-blue-50 p-2 items-center justify-center text-blue-600">
            <Icon name="heroicons:user-minus" class="size-6" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between">
          <span class="text-3xl font-extrabold text-slate-900">{{ overviewData.churnRate }}</span>
          <span class="inline-flex items-center text-xs font-semibold text-emerald-600">↓ 0.4%</span>
        </div>
        <p class="mt-1 text-xs text-slate-400">Below industry benchmark (2.5%)</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div class="flex items-center justify-between gap-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Monthly Comparison</span>
          <div class="flex rounded-lg bg-amber-50 p-2 items-center justify-center text-amber-500">
            <Icon name="heroicons:scale" class="size-6" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between">
          <span class="text-3xl font-extrabold text-slate-900">1.24x</span>
          <span class="inline-flex items-center text-xs font-semibold text-amber-600">Target Met</span>
        </div>
        <p class="mt-1 text-xs text-slate-400">MoM growth multiple score</p>
      </div>
    </div>

    <!-- Main Overview Chart -->
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      <h2 class="text-base font-semibold text-slate-900 mb-4">Overall Performance Trend</h2>
      <div class="h-72">
        <ClientOnly>
          <Line :data="overviewData.chartData" :options="chartOptions" />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>