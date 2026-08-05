<script setup lang="ts">
import { useNotificationStore } from '~/stores/notification'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()
const store = useNotificationStore()
const modalRef = ref<HTMLElement | null>(null)

// Handle click outside to auto-close the dropdown
const handleClickOutside = (event: MouseEvent) => {
  if (modalRef.value && !modalRef.value.contains(event.target as Node)) {
    store.closeNotifications()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div
    ref="modalRef"
    v-if="store.isOpen"
    class="absolute right-0 z-50 mt-2 w-80 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 p-3 shadow-xl theme-transition"
  >
    <div class="mb-2 flex items-center justify-between border-b border-slate-500 pb-2">
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-slate-900 dark:text-slate-50">System Updates</span>
        <span
          v-if="store.hasUnread"
          class="rounded-full  px-1.5 py-0.5 text-[10px] font-medium text-white"
        >
          New
        </span>
      </div>
      <button
        @click="store.markAllAsRead"
        class="text-[10px] font-medium text-slate-800 dark:text-slate-200 hover:text-slate-500 transition-colors"
      >
        Mark all read
      </button>
    </div>

    <div class="flex max-h-72 flex-col gap-2 overflow-y-auto text-xs">
      <div
        v-for="item in store.notifications"
        :key="item.id"
        class="rounded-md border border-slate-500 bg-slate-50 dark:bg-slate-800 p-2.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-900"
        :class="{ 'border-l-2': !item.read }"
        :style="{ 'border-left-color': settingsStore.activeAccentHex}"
      >
        <div class="flex items-center justify-between">
          <p class="font-medium text-slate-900 dark:text-slate-50">{{ item.title }}</p>
          <span class="text-[10px] text-slate-800 dark:text-slate-200">{{ item.timestamp }}</span>
        </div>
        <p class="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
          {{ item.message }}
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-if="store.notifications.length === 0"
        class="py-6 text-center text-xs text-[var(--text-secondary)]"
      >
        No updates right now.
      </div>
    </div>
  </div>
</template>