<!-- pages/customers/index.vue -->
<script setup lang="ts">
import type { Customer, CustomerPlan } from '~/types/customer'
import TableData, { type Column } from '~/components/tableData.vue'
import { useCustomers } from '~/composables/useCustomers'

defineProps<{
  value: number
}>()

const router = useRouter()
const { customers } = useCustomers()

// Reactive filter and instant non-enter search state
const searchQuery = ref('')
const selectedPlan = ref<CustomerPlan | 'All'>('All')

// Live Filter computation
const filteredCustomers = computed(() => {
  
  return customers.value.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesPlan = selectedPlan.value === 'All' || c.plan === selectedPlan.value

    return matchesSearch && matchesPlan
  })
})

const columns: Column<Customer>[] = [
  { key: 'name', label: 'Customer', sortable: true },
  { key: 'plan', label: 'PlanLevel', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'arr', label: 'ARR', sortable: true, formatter: (val) => typeof val === 'number' ? `$${val.toLocaleString()}` : val },
  { key: 'usagePercent', label: 'Usage', sortable: true, formatter: (val) => typeof val === 'number' ? `${val}%` : val },
  { key: 'action', label: 'Details' }
]

const navigateToDetail = (cust: Customer) => {
  router.push(`/customers/${cust.id}`)
}

const isHighUsage = (val: unknown, threshold = 80): boolean => {
  return typeof val === 'number' && val > threshold
}

const formatPercent = (val: unknown): string => {
  return typeof val === 'number' ? `${val}%` : `${String(val ?? '0')}%`
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Customer Directory</h1>
        <p class="text-sm text-slate-500 dark:text-slate-300">Manage accounts, tiers, and subscription statuses.</p>
      </div>

      <button
        class="inline-flex items-center gap-2 rounded-xl bg-accent dark:bg-accent/10 px-4 py-2.5 text-xs font-semibold text-slate-50 shadow-xs transition-all hover:bg-accent dark:hover:bg-accent/30 border border-transparent dark:border-accent-border active:scale-95"
      >
        <Icon name="heroicons:user-plus-20-solid" class="size-4" />
        Add Customer
      </button>
    </div>

    <!-- Search & Filter Controls -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-accent-border bg-white dark:bg-slate-900 p-4 shadow-xs">
      <!-- Instant Reactive Search Field -->
      <div class="relative w-full sm:w-80">
        <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-2.5 size-4 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search name, plan level, or status..."
          class="w-full rounded-xl border border-slate-200 dark:border-accent-border bg-slate-50/50 dark:bg-accent/20 pl-9 pr-4 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder:text-slate-300 outline-hidden transition-all focus:border-accent focus:bg-white dark:focus:bg-accent/20 focus:ring-2 focus:ring-accent"
        />
      </div>

      <!-- Plan Level Dropdown -->
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <span class="text-xs font-medium text-slate-500 dark:text-slate-200 whitespace-nowrap">Plan Level:</span>
        <select
          v-model="selectedPlan"
          class="w-full sm:w-44 rounded-xl border border-slate-200 dark:border-accent-border bg-slate-50/50 dark:bg-accent/20 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-hidden transition-all focus:border-accent focus:bg-white dark:focus:bg-accent/20 focus:ring-2 focus:ring-accent"
        >
          <option value="All">All Plans</option>
          <option value="Enterprise">Enterprise</option>
          <option value="Professional">Professional</option>
          <option value="Starter">Starter</option>
          <option value="Trial">Trial</option>
        </select>
      </div>
    </div>

    <TableData :columns="columns" :data="filteredCustomers">
      <template #cell-name="{ row }">
        <div class="flex items-center gap-3">
          <div>
            <div class="font-bold text-slate-900 dark:text-slate-50 group-hover:text-accent dark:group-hover:text-slate-50 transition-colors">{{ row.name }}</div>
            <div class="text-[11px] text-slate-400 dark:text-slate-200">{{ row.email }}</div>
          </div>
        </div>
      </template>

      <template #cell-plan="{ value }">
        <span
          class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold uppercase"
          :class="{
          'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800': value === 'Enterprise',
          'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800': value === 'Professional',
          'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700': value === 'Starter',
          'bg-slate-50 text-slate-500 border border-dashed border-slate-300 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700': value === 'Trial'
        }"
        >
          <Icon v-if="value === 'Enterprise'" name="heroicons:star-solid" class="size-3 text-amber-500" />
          {{ value }}
        </span>
      </template>

      <template #cell-status="{ value }">
        <span
          class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold"
          :class="{
            'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400': value === 'Active',
            'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400': value === 'Pending',
            'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400': value === 'Overdue'
          }"
        >
          {{ value }}
        </span>
      </template>

      <template #cell-usagePercent="{ value }">
        <div class="w-28 space-y-1">
          <div class="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-300">
            <span>Quota</span>
            <span :class="isHighUsage(value) ? 'text-amber-600 dark:text-amber-400 font-extrabold' : 'text-slate-700 dark:text-slate-300'">
              {{ formatPercent(value) }}
            </span>
          </div>
          <div class="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-300"
              :class="isHighUsage(value) ? 'bg-amber-500 dark:bg-amber-400' : 'bg-blue-600 dark:bg-blue-500'"
              :style="{ width: formatPercent(value) }"
            ></div>
          </div>
        </div>
      </template>

      <!-- Custom Action Button -->
      <template #cell-action="{ row }">
        <button @click.stop="navigateToDetail(row)"
          class="inline-flex items-center gap-1.5 rounded-lg bg-accent dark:bg-accent/20 px-3 py-1.5 text-xs font-bold text-slate-50 shadow-xs transition-all hover:bg-accent dark:hover:bg-accent/40 border border-transparent dark:border-accent-border active:scale-95"
        >
         
          <span>View</span>
          <Icon name="heroicons:arrow-right-20-solid" class="size-3.5" />
        </button>
      </template>
    </TableData>
  </div>
</template>