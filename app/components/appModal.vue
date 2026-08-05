<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  subtitle?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  maxWidth: 'md'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Max-width lookup object
const maxWidthClass = computed(() => {
  const map = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  }
  return map[props.maxWidth]
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-backdrop">
      <div
        v-if="modelValue"
        @click="handleClose"
        class="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs"
      >
        <Transition name="modal-panel">
          <div
            v-if="modelValue"
            @click.stop
            class="w-full rounded-2xl border border-slate-200 dark:border-accent-border bg-white dark:bg-slate-900 p-6 shadow-xl overflow-hidden transition-all"
            :class="maxWidthClass"
          >
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-accent-border">
              <slot name="header">
                <div>
                  <h3 v-if="title" class="text-base font-bold text-slate-900 dark:text-slate-50">{{ title }}</h3>
                  <p v-if="subtitle" class="text-[11px] text-slate-400 dark:text-slate-300">{{ subtitle }}</p>
                </div>
              </slot>

              <button
                @click="handleClose"
                class="rounded-lg p-1.5 text-slate-400 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <Icon name="heroicons:x-mark-20-solid" class="size-5" />
              </button>
            </div>

            <!-- Main Body Slot -->
            <div class="py-4">
              <slot />
            </div>

            <div v-if="$slots.footer" class="pt-4 border-t border-slate-100 dark:border-accent-border flex justify-end gap-2">
              <slot name="footer" :close="handleClose" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>

.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.2s ease;
}
.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-panel-enter-active,
.modal-panel-leave-active {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}
.modal-panel-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.modal-panel-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>