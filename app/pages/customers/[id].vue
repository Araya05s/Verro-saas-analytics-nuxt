<!-- pages/customers/[id].vue -->
<script setup lang="ts">
import type { CustomerPlan } from '~/types/customer'
import { useCustomers } from '~/composables/useCustomers'

const route = useRoute()
const router = useRouter()
const { customers } = useCustomers()

// Locate target customer by ID
const customer = computed(() => customers.value.find((c) => c.id === route.params.id))

// Fallback redirect if record doesn't exist
if (!customer.value) {
  router.push('/customers')
}

// Admin Editing State
const isEditing = ref(false)
const selectedEditPlan = ref<CustomerPlan>(customer.value?.plan || 'Starter')

const savePlanChange = () => {
  if (customer.value) {
    customer.value.plan = selectedEditPlan.value
    // Real-time audit log insertion
    customer.value.activities.unshift({
      id: `act-${Date.now()}`,
      action: `Admin changed plan level to ${selectedEditPlan.value}`,
      timestamp: 'Just now',
      icon: 'heroicons:shield-check'
    })
  }
  isEditing.value = false
}
</script>

<template>
  <div v-if="customer" class="space-y-6">
    <!-- Breadcrumbs / Back button -->
    <div class="flex items-center justify-between">
      <button
        @click="router.push('/customers')"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <Icon name="heroicons:arrow-left-20-solid" class="size-4" />
        Back to Customers
      </button>

      <span class="text-xs font-mono text-slate-400">ID: {{ customer.id }}</span>
    </div>

    <!-- Asymmetrical Grid Layout (5:7 ratio on desktop) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <!-- Left Column: Primary Profile & Admin Plan Controls (5 cols) -->
      <div class="lg:col-span-5 space-y-6">
        
        <!-- Profile Metric Card -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs relative overflow-hidden">
          <div class="flex flex-col items-center text-center">
            <img
              :src="customer.avatar"
              :alt="customer.name"
              class="size-24 rounded-full object-cover ring-4 ring-blue-50 shadow-md mb-3"
            />
            <h2 class="text-xl font-bold text-slate-900">{{ customer.name }}</h2>
            <p class="text-xs text-slate-400 font-medium">{{ customer.email }}</p>

            <!-- Plan Badge -->
            <div class="mt-3">
              <span
                class="inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-extrabold uppercase tracking-wider"
                :class="{
                  'bg-amber-50 text-amber-700 border border-amber-200': customer.plan === 'Enterprise',
                  'bg-blue-50 text-blue-700 border border-blue-200': customer.plan === 'Professional',
                  'bg-slate-100 text-slate-700 border border-slate-200': customer.plan === 'Starter',
                  'bg-slate-50 text-slate-500 border border-dashed border-slate-300': customer.plan === 'Trial'
                }"
              >
                <Icon v-if="customer.plan === 'Enterprise'" name="heroicons:star-solid" class="size-3.5 text-amber-500" />
                {{ customer.plan }} Plan
              </span>
            </div>
          </div>

          <div class="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400">ARR Value</span>
              <p class="text-lg font-extrabold text-slate-900">${{ customer.arr.toLocaleString() }}</p>
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400">Customer Since</span>
              <p class="text-xs font-semibold text-slate-700 mt-1">{{ customer.joinedDate }}</p>
            </div>
          </div>
        </div>

        <!-- Admin Control: Edit Plan Mode -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <Icon name="heroicons:cog-6-tooth" class="size-5 text-blue-600" />
              <h3 class="text-sm font-bold text-slate-900">Admin Controls</h3>
            </div>
            <button
              @click="isEditing = !isEditing"
              class="text-xs font-bold text-blue-600 hover:underline"
            >
              {{ isEditing ? 'Cancel' : 'Edit Plan' }}
            </button>
          </div>

          <div v-if="isEditing" class="space-y-4 pt-2">
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Select Subscription Tier</label>
              <select
                v-model="selectedEditPlan"
                class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white"
              >
                <option value="Enterprise">Enterprise</option>
                <option value="Professional">Professional</option>
                <option value="Starter">Starter</option>
                <option value="Trial">Trial</option>
              </select>
            </div>

            <button
              @click="savePlanChange"
              class="w-full rounded-xl bg-blue-600 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
            >
              Update Subscription Level
            </button>
          </div>

          <p v-else class="text-xs text-slate-400">
            Admins can adjust customer plan levels, apply enterprise overrides, or adjust quotas manually.
          </p>
        </div>

      </div>

      <!-- Right Column: Usage, Invoices, Activity Stream (7 cols) -->
      <div class="lg:col-span-7 space-y-6">

        <!-- Usage Quota Metric Card -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase text-slate-400">System API & Storage Usage</span>
            <span class="text-xs font-extrabold text-blue-600">{{ customer.usagePercent }}% Used</span>
          </div>
          <div class="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="customer.usagePercent > 80 ? 'bg-amber-500' : 'bg-blue-600'"
              :style="{ width: `${customer.usagePercent}%` }"
            ></div>
          </div>
          <p class="mt-2 text-xs text-slate-400">Quota resets on the 1st of next month.</p>
        </div>

        <!-- Invoices Table -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 class="text-sm font-bold text-slate-900 mb-4">Billing & Invoices</h3>
          
          <div v-if="customer.invoices.length > 0" class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-400 uppercase font-semibold">
                <tr>
                  <th class="p-2.5">Invoice ID</th>
                  <th class="p-2.5">Date</th>
                  <th class="p-2.5">Amount</th>
                  <th class="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="inv in customer.invoices" :key="inv.id">
                  <td class="p-2.5 font-mono font-bold text-slate-800">{{ inv.id }}</td>
                  <td class="p-2.5 text-slate-500">{{ inv.date }}</td>
                  <td class="p-2.5 font-bold text-slate-900">${{ inv.amount }}</td>
                  <td class="p-2.5">
                    <span
                      class="rounded-full px-2 py-0.5 text-[10px] font-bold"
                      :class="inv.status === 'Paid' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-700'"
                    >
                      {{ inv.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="text-xs text-slate-400">No generated invoices for this trial account.</p>
        </div>

        <!-- Recent Activity Audit Stream -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 class="text-sm font-bold text-slate-900 mb-4">Recent Customer Activity</h3>
          
          <div class="space-y-4">
            <div
              v-for="act in customer.activities"
              :key="act.id"
              class="flex items-start gap-3 text-xs"
            >
              <div class="flex size-7 rounded-lg bg-blue-50 items-center justify-center text-blue-600 shrink-0 mt-0.5">
                <Icon :name="act.icon" class="size-4" />
              </div>
              <div class="flex-1">
                <p class="font-semibold text-slate-800">{{ act.action }}</p>
                <span class="text-[10px] text-slate-400">{{ act.timestamp }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>