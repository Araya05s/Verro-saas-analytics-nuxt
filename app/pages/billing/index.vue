<!-- pages/billing/index.vue -->
<script setup lang="ts">
import { useBillingStore, type SubscriptionTier } from '~/stores/billing'

const billingStore = useBillingStore()

interface PlanCard {
  name: SubscriptionTier
  price: number
  billingPeriod: string
  description: string
  features: string[]
  isPopular?: boolean
}

const plans: PlanCard[] = [
  {
    name: 'Starter',
    price: 49,
    billingPeriod: 'per month',
    description: 'Essential toolkit for small teams and early-stage startups.',
    features: ['Up to 5 team members', 'Basic Analytics', '10GB Storage', 'Community Support']
  },
  {
    name: 'Professional',
    price: 149,
    billingPeriod: 'per month',
    description: 'Advanced capabilities and analytics for growing organizations.',
    isPopular: true,
    features: ['Up to 25 team members', 'Advanced Real-time Analytics', '100GB Storage', 'Priority Email Support', 'Custom Integrations']
  },
  {
    name: 'Enterprise',
    price: 499,
    billingPeriod: 'per month',
    description: 'Unrestricted control, dedicated infrastructure, and SLA support.',
    features: ['Unlimited team members', 'Custom Analytics & Reports', '1TB Dedicated Storage', '24/7 Phone & SLA Support', 'Dedicated Account Manager']
  }
]

const handleUpgrade = (tier: SubscriptionTier) => {
  billingStore.setSubscriptionTier(tier)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Subscription Plans</h1>
        <p class="text-sm text-slate-500">Manage your subscription level and administrative billing tiers.</p>
      </div>

      <div class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-xs">
        <span class="text-xs font-semibold text-slate-500">Active Tier:</span>
        <span class="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-extrabold text-blue-600">
          <Icon name="heroicons:shield-check-20-solid" class="size-4" />
          {{ billingStore.currentTier }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
      <div
        v-for="plan in plans"
        :key="plan.name"
        class="relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-200"
        :class="[
          billingStore.currentTier === plan.name
            ? 'border-blue-600 bg-white ring-2 ring-blue-600/10 shadow-md'
            : plan.isPopular
              ? 'border-amber-300 bg-white shadow-xs'
              : 'border-slate-200 bg-white shadow-xs hover:border-slate-300'
        ]"
      >
        <!-- Highlight Tag for Popular / Active -->
        <div v-if="plan.isPopular && billingStore.currentTier !== plan.name" class="absolute -top-3 right-6">
          <span class="inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-900 shadow-xs">
            <Icon name="heroicons:star-solid" class="size-3" />
            Most Popular
          </span>
        </div>

        <div v-if="billingStore.currentTier === plan.name" class="absolute -top-3 right-6">
          <span class="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
            <Icon name="heroicons:check-circle-20-solid" class="size-3" />
            Current Plan
          </span>
        </div>

        <div>
          <h2 class="text-xl font-bold text-slate-900">{{ plan.name }}</h2>
          <p class="mt-1 text-xs text-slate-500 min-h-8">{{ plan.description }}</p>

          <div class="mt-6 flex items-baseline gap-1">
            <span class="text-4xl font-extrabold text-slate-900">${{ plan.price }}</span>
            <span class="text-xs font-semibold text-slate-400">/ {{ plan.billingPeriod }}</span>
          </div>

          <div class="my-6 border-t border-slate-100"></div>

          <ul class="space-y-3">
            <li v-for="feat in plan.features" :key="feat" class="flex items-start gap-2 text-xs text-slate-700">
              <Icon name="heroicons:check-20-solid" class="size-4 shrink-0 text-blue-600 mt-0.5" />
              <span>{{ feat }}</span>
            </li>
          </ul>
        </div>

        <div class="mt-8 pt-4">
          <button
            @click="handleUpgrade(plan.name)"
            :disabled="billingStore.currentTier === plan.name"
            class="w-full rounded-xl py-2.5 text-xs font-bold transition-all duration-150 active:scale-95"
            :class="[
              billingStore.currentTier === plan.name
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : plan.isPopular
                  ? 'bg-amber-400 text-slate-900 hover:bg-amber-500 shadow-xs'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
            ]"
          >
            {{ billingStore.currentTier === plan.name ? 'Active Subscription' : `Switch to ${plan.name}` }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>