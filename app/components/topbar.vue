<script setup lang="ts">
import { useSettingsStore} from '~/stores/settings'
import { useNotificationStore } from '~/stores/notification'
import NotificationModal from './notificationModal.vue'

const settingsStore = useSettingsStore()
const notificationStore = useNotificationStore()



onMounted(() => {
  settingsStore.applyThemeToDOM()
})
</script>

<template>
    <header class="top-0 z-50 border-b border-slate-200 dark:border-accent bg-white dark:bg-slate-950 shadow-xs">
      <div class="mx-auto flex w-full items-center justify-between px-6 py-4">
       <!-- Toggle Button (Visible on mobile/sm screens) -->
      <button
        type="button"
        @click="settingsStore.toggleSidebarOpen()"
        class="md:hidden flex mr-4 rounded-md text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-400 focus:outline-none"
        :aria-expanded="settingsStore.isSidebarOpen"
        aria-label="Toggle Navigation Menu"
      >
        <Icon 
          :name="settingsStore.isSidebarOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" 
          class="w-6 h-6" 
        />
    </button>
       
        <!-- Logo -->
        <div class="flex md:hidden items-center space-x-2">
          <span class="flex text-xl gap-1 font-bold tracking-tight text-slate-900 dark:text-slate-50">Verro<span class="text-accent">Analytics</span></span>
        </div>

        <div class="flex ml-auto items-center space-x-4">
          
          <span class="hidden sm:flex items-center gap-2 rounded-full bg-blue-50 dark:bg-slate-900 border-b border-blue-500 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-50 ring-1 ring-blue-500/20 md:inline-flex">
            Professional Plan
          </span>
          <div class="flex items-center gap-1">
            <div class="relative">
                <button
                    @click.stop="notificationStore.toggleNotifications"
                    type="button"
                    aria-label="Toggle notifications"
                    class="relative flex h-8 w-8 items-center justify-center rounded-md border border-slate-500 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-50/50"
                  >
                    <Icon name="heroicons:bell" class="h-4 w-4" />
                    
                    <span v-if="notificationStore.hasUnread" class="absolute right-1.5 top-1.5 flex h-2 w-2">
                      <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                      <span class="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
                    </span>
                  </button>

                  <!-- Notification Modal Component -->
                  <NotificationModal />
                </div>
              </div>

            <button class="relative flex h-8 w-8 items-center justify-center rounded-md border border-slate-500 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-50">
              <Icon name="heroicons:user" class="size-6" />
            </button>
          </div>
        </div>
    </header>
</template>