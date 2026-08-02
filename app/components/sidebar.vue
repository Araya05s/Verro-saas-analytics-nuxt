<script setup lang="ts">
import { sidebarNavigation } from '~/config/sidebar-data'
import { useSettingsStore} from '~/stores/settings'

const settingsStore = useSettingsStore()

const route = useRoute()

const openDropdowns = ref<Record<string, boolean>>({})

const toggleDropdown = (title: string) => {
  openDropdowns.value[title] = !openDropdowns.value[title]
}

const isChildActive = (item: typeof sidebarNavigation[number]): boolean => {
  if (!item.children) return false
  return item.children.some(child => child.to && route.path.startsWith(child.to))
}

// Automatically expand dropdown if the button with children is clicked
onMounted(() => {
  sidebarNavigation.forEach((item) => {
    if (item.children && isChildActive(item)) {
      openDropdowns.value[item.title] = true
    }
  })
})
</script>

<template>
  <header class="sticky top-0 left-0 z-50 h-screen border-b bg-white dark:bg-slate-950 shadow-xs"
    :style="{ 'border-color': settingsStore.activeAccentHex }">
      <div class="flex flex-col max-w-m w-2xs  px-6 py-4">
        <div class="flex flex-col space-x-8">
          <!-- Logo -->
          <div class="flex items-center space-x-2 pb-4">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 dark:bg-slate-900 text-lg font-bold text-white border border-transparent dark:border-emerald-600 shadow-sm">
              V
            </div>
            <span class="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Verro <span class="text-emerald-600">Analytics</span></span>
          </div>

          <!-- Nav Links -->
          <nav class="hidden space-y-1 md:flex flex-col">
            <template v-for="item in sidebarNavigation" :key="item.title">
        
        <!-- CASE 1: Single Route Item -->
        <NuxtLink
          v-if="!item.children && item.to"
          :to="item.to"
          class="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900 hover:text-gray-900 dark:hover:text-slate-300 border border-transparent dark:hover:border-emerald-700 transition-colors"
          active-class="!bg-emerald-50 dark:!bg-slate-900 !text-emerald-700 dark:!text-emerald-400 dark:!border-emerald-500 font-semibold"
        >
          <Icon v-if="item.icon" :name="item.icon" class="w-5 h-5 shrink-0" />
          <span>{{ item.title }}</span>
        </NuxtLink>

        <!-- CASE 2: Accordion Parent Dropdown -->
        <div v-else-if="item.children" class="flex flex-col">
          <button
            type="button"
            class="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900 hover:text-gray-900 dark:hover:text-slate-300 border border-transparent dark:hover:border-emerald-700 transition-colors"
            :class="{ 'text-emerald-700 dark:bg-slate-900 dark:text-emerald-400 dark:border-emerald-500 font-semibold': isChildActive(item) }"
            @click="toggleDropdown(item.title)"
          >
            <div class="flex items-center gap-3">
              <Icon v-if="item.icon" :name="item.icon" class="w-5 h-5 shrink-0" />
              <span>{{ item.title }}</span>
            </div>
            
            <Icon 
              name="heroicons:chevron-down-20-solid" 
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': openDropdowns[item.title] }"
            />
          </button>

          <!-- Hidden Sub-list -->
          <div 
            v-show="openDropdowns[item.title]" 
            class="flex flex-col gap-1 pl-9 mt-1"
          >
            <NuxtLink
              v-for="child in item.children"
              :key="child.to"
              :to="child.to!"
              class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-300 border border-transparent dark:hover:border-emerald-700 transition-colors""
              active-class="!bg-emerald-50 dark:!bg-slate-900 !text-emerald-700 dark:!text-emerald-400 dark:!border-emerald-500 font-semibold"
            >
              {{ child.title }}
            </NuxtLink>
          </div>
        </div>

      </template>
            <!-- <a href="#" class="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">Dashboard</a>
            <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Audience</a>
            <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Revenue</a>
            <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Settings</a> -->
          </nav>
        </div>

      </div>
    </header>
</template>