<!-- pages/analytics/users.vue -->
<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { TIME_FILTERS, type TimeFilter } from '~/types/analytics'

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

// User Tier Distribution Chart Data
const tierChartData = computed(() => ({
  labels: ['Free Tier', 'Pro Plan', 'Enterprise'],
  datasets: [
    {
      data: [55, 30, 15],
      backgroundColor: ['#94a3b8', '#2563eb', '#eab308'], // Neutral Slate, Secondary Blue, Highlight Yellow
      borderWidth: 0
    }
  ]
}))

const tierChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'right' as const } }
}

const locations = [
  { country: 'United States', code: 'US', share: '42%', count: '5,229' },
  { country: 'Germany', code: 'DE', share: '18%', count: '2,241' },
  { country: 'United Kingdom', code: 'UK', share: '14%', count: '1,743' },
  { country: 'Indonesia', code: 'ID', share: '12%', count: '1,494' },
  { country: 'Others', code: 'WW', share: '14%', count: '1,743' }
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">User Analytics</h1>
        <p class="text-sm text-slate-500">Demographics, retention, and conversion metrics.</p>
      </div>

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

    <!-- User Metrics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- New Users -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div class="flex items-center justify-between gap-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">New Users</span>
          <div class="flex rounded-lg bg-blue-50 p-2 items-center justify-center text-blue-600">
            <Icon name="heroicons:user-plus" class="size-6" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between">
          <span class="text-3xl font-extrabold text-slate-900">{{ userStats.newUsers.toLocaleString() }}</span>
          <span class="inline-flex items-center text-xs font-semibold text-blue-600">↑ 14%</span>
        </div>
        <p class="mt-1 text-xs text-slate-400">First-time account registrations</p>
      </div>

      <!-- Returning Users -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div class="flex items-center justify-between gap-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Returning Users</span>
          <div class="flex rounded-lg bg-blue-50 p-2 items-center justify-center text-blue-600">
            <Icon name="heroicons:arrow-path" class="size-6" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between">
          <span class="text-3xl font-extrabold text-slate-900">{{ userStats.returningUsers.toLocaleString() }}</span>
          <span class="inline-flex items-center text-xs font-semibold text-blue-600">82% retention</span>
        </div>
        <p class="mt-1 text-xs text-slate-400">Repeat active sessions</p>
      </div>

      <!-- Active Users -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div class="flex items-center justify-between gap-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Users</span>
          <div class="flex rounded-lg bg-amber-50 p-2 items-center justify-center text-amber-500">
            <Icon name="heroicons:bolt" class="size-6" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between">
          <span class="text-3xl font-extrabold text-slate-900">{{ userStats.activeUsers.toLocaleString() }}</span>
          <span class="inline-flex items-center text-xs font-semibold text-amber-600">★ High Activity</span>
        </div>
        <p class="mt-1 text-xs text-slate-400">Active within filter frame</p>
      </div>

      <!-- Conversion -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div class="flex items-center justify-between gap-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Conversion Rate</span>
          <div class="flex rounded-lg bg-amber-50 p-2 items-center justify-center text-amber-500">
            <Icon name="heroicons:funnel" class="size-6" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between">
          <span class="text-3xl font-extrabold text-slate-900">{{ userStats.conversionRate }}%</span>
          <span class="inline-flex items-center text-xs font-semibold text-amber-600">+0.6%</span>
        </div>
        <p class="mt-1 text-xs text-slate-400">Free-to-paid conversion</p>
      </div>
    </div>

    <!-- Charts & Location Split Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Tier Breakdown Doughnut -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 class="text-base font-semibold text-slate-900 mb-4">User Tier Distribution</h2>
        <div class="h-56">
          <ClientOnly>
            <Doughnut :data="tierChartData" :options="tierChartOptions" />
          </ClientOnly>
        </div>
      </div>

      <!-- Location Distribution -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-slate-900">User Location Breakdown</h2>
          <Icon name="heroicons:globe-alt" class="size-5 text-slate-400" />
        </div>
        <div class="space-y-3">
          <div v-for="loc in locations" :key="loc.code" class="space-y-1">
            <div class="flex justify-between text-xs font-medium text-slate-700">
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