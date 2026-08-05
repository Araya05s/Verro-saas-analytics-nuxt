<script setup lang="ts">
export interface MetricCardProps {
  title: string
  value: string | number
  subtext?: string
  icon?: string
  trend?: string
  trendType?: 'positive' | 'negative' | 'neutral'
  
  // Dynamic Accent Toggle
  useAccentIcon?: boolean
  
  variantClass?: string
  iconContainerClass?: string
  iconClass?: string
  titleClass?: string
}

const props = withDefaults(defineProps<MetricCardProps>(), {
  subtext: '',
  icon: '',
  trend: '',
  trendType: 'positive',
  useAccentIcon: false,
  
  variantClass: 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900',
  iconContainerClass: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent',
  iconClass: '',
  titleClass: 'text-slate-400 dark:text-slate-300'
})

const trendColorClass = computed(() => {
  if (props.trendType === 'positive') return 'text-emerald-500'
  if (props.trendType === 'negative') return 'text-rose-500'
  return 'text-slate-400 dark:text-slate-300'
})

const computedIconContainerClass = computed(() => {
  if (props.useAccentIcon) {
    return 'bg-accent/10 dark:bg-accent/5 text-accent border-transparent dark:border-accent-border'
  }
  return props.iconContainerClass
})
</script>

<template>
  <div 
    class="rounded-2xl border p-6 shadow-xs transition-colors"
    :class="variantClass"
  >
    <div class="flex items-center justify-between gap-2">
      <span 
        class="text-xs font-semibold uppercase tracking-wider"
        :class="titleClass"
      >
        {{ title }}
      </span>

      <div 
        class="flex items-center justify-center rounded-lg p-2 border"
        :class="computedIconContainerClass"
      >
        <slot name="icon">
          <Icon 
            v-if="icon" 
            :name="icon" 
            class="size-6" 
            :class="iconClass"
          />
        </slot>
      </div>
    </div>

    <div class="mt-4 flex items-baseline justify-between">
      <span class="text-3xl font-extrabold text-slate-900 dark:text-slate-200">
        {{ value }}
      </span>

      <slot name="trend">
        <span 
          v-if="trend" 
          class="inline-flex items-center text-xs font-semibold"
          :class="trendColorClass"
        >
          {{ trend }}
        </span>
      </slot>
    </div>

    <p 
      v-if="subtext || $slots.subtext" 
      class="mt-1 text-xs text-slate-400 dark:text-slate-300"
    >
      <slot name="subtext">
        {{ subtext }}
      </slot>
    </p>
  </div>
</template>