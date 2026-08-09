<script setup lang="ts">
import { sidebarNavigation } from '~/config/sidebar-data'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '#imports'

const settingsStore = useSettingsStore()
const route = useRoute()

const openDropdowns = ref<string | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = (title: string) => {
  openDropdowns.value = openDropdowns.value === title ? null : title
}

const isChildActive = (item: typeof sidebarNavigation[number]): boolean => {
  if (!item.children) return false
  return item.children.some(child => child.to && route.path.startsWith(child.to))
}


const { sidebarStyle } = storeToRefs(settingsStore)
const { isSidebarOpen } = storeToRefs(settingsStore)

const handleClickOutsideCompactSublist = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    openDropdowns.value = null
  }
}
// Automatically expand dropdown if the button with children is clicked
onMounted(() => {
  sidebarNavigation.forEach((item) => {
    document.addEventListener('click', handleClickOutsideCompactSublist)
  })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutsideCompactSublist)
})
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isSidebarOpen"
      @click="settingsStore.toggleSidebarClose"
      class="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-md md:hidden"
      aria-hidden="true"
    />
  </Transition>
  <div 
  ref="dropdownRef"
  class="relative z-50 group"
  :class="{ 'fixed top-0 left-0 h-dvh w-4': sidebarStyle === 'collapsed' }"
  >
    <header class="absolute md:sticky top-16 md:top-0 -left-90 md:left-0 min-h-screen h-dvh border-b border-accent-border bg-white dark:bg-slate-950 shadow-xs transition-all duration-200"
    :class="[
        sidebarStyle === 'expanded' ? 'w-72' : '',
        sidebarStyle === 'compact' ? 'w-16' : '',
        sidebarStyle === 'collapsed' ? 'w-0 border-none group-hover:w-72 group-hover:absolute group-hover:shadow-2xl' : '',
        isSidebarOpen ? 'translate-x-90' : 'translate-x-0'
      ]"
      >
      <div class="flex flex-col max-w-m w-2xs px-6 py-4">
        <div class="flex flex-col space-x-8">
          <!-- Logo -->
          <div class="hidden md:flex items-center space-x-2 pb-4">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-accent dark:bg-slate-900 text-lg font-bold text-white border border-transparent dark:border-accent-border shadow-sm">
              V
            </div>
            <span class="flex text-xl gap-1 font-bold tracking-tight text-slate-900 dark:text-slate-50">Verro <span class="text-accent">Analytics</span></span>
          </div>

          <!-- Nav Links -->
          <nav class="flex flex-col space-y-1"
          :class="[
            sidebarStyle === 'expanded' ? 'max-w-60' : '',
            sidebarStyle === 'compact' ? 'max-w-10' : '',
            sidebarStyle === 'collapsed' ? 'max-w-0 invisible transparent group-hover:max-w-60 group-hover:visible' : ''
          ]">
            <template v-for="item in sidebarNavigation" :key="item.title">
              
              <!-- CASE 1: Single Route Item -->
              <NuxtLink
                v-if="!item.children && item.to"
                :to="item.to"
                :class="sidebarStyle === 'compact' ? 'max-w-9' : ''"
                class="flex items-center gap-3 w-full pr-3 pl-1.5 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900 hover:text-gray-900 dark:hover:text-slate-300 border border-transparent dark:hover:border-accent-border transition-colors"
                active-class="!bg-accent/5 dark:!bg-slate-900 !text-accent dark:!text-accent-dark dark:!border-accent-border font-semibold"
                @click="settingsStore.toggleSidebarClose"
              >
                <Icon v-if="item.icon" :name="item.icon" class="w-5 h-5 shrink-0" />
                <span :class="sidebarStyle === 'compact' ? 'invisible' : ''">{{ item.title }}</span>
              </NuxtLink>

              <!-- CASE 2: Accordion Parent Dropdown -->
              <div v-else-if="item.children" class="flex flex-col">
                <button
                  type="button"
                  :class="sidebarStyle === 'compact' ? 'max-w-9' : { 'text-accent-dark dark:bg-slate-900 dark:text-accent dark:border-accent-border font-semibold': isChildActive(item) }"
                  class="flex items-center justify-between w-full pr-3 pl-1.5 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900 hover:text-gray-900 dark:hover:text-slate-300 border border-transparent dark:hover:border-accent-border transition-colors"
                  @click="toggleDropdown(item.title)"
                >
                  <div class="flex items-center gap-3">
                    <Icon v-if="item.icon" :name="item.icon" class="w-5 h-5 shrink-0" />
                    <span :class="sidebarStyle === 'compact' ? 'hidden' : ''">{{ item.title }}</span>
                  </div>
                  
                  <Icon 
                    name="heroicons:chevron-down-20-solid" 
                    class="w-4 h-4 transition-transform duration-200"
                    :class="sidebarStyle === 'compact' ? 'hidden' : { 'rotate-180': openDropdowns === item.title }"
                  />
                </button>
              </div>

              <div
               class="relative group"
               >

                 <!-- Default Hidden Sub-list -->
                <div 
                  v-if="sidebarStyle !== 'compact'"
                  v-show="openDropdowns === item.title" 
                  class="flex flex-col gap-1 pl-9 mt-1"
                >
                  <NuxtLink
                    v-for="child in item.children"
                    :key="child.to"
                    :to="child.to!"
                    class="rounded-lg pr-3 pl-1.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-300 border border-transparent dark:hover:border-accent-border transition-colors"
                    active-class="!bg-accent/5 dark:!bg-slate-900 !text-accent dark:!text-accent-dark dark:!border-accent-border font-semibold"
                    @click="settingsStore.toggleSidebarClose"
                  >
                    {{ child.title }}
                  </NuxtLink>
                </div>

                <!-- Compact Dropdown Menu -->
                <Transition
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="-translate-x-64 opacity-0"
                  enter-to-class="translate-x-0 opacity-100"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="translate-x-0 opacity-100"
                  leave-to-class="-translate-x-64 opacity-0"
                >
                  <div 
                    v-if="sidebarStyle === 'compact'"
                    v-show="openDropdowns === item.title" 
                    class="absolute left-full -top-12 ml-3 flex flex-col min-w-52 p-1.5 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-xl shadow-xl z-50 transition-all"
                  >
                    <!-- Sublist Title Header -->
                    <div class="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200/60 dark:border-accent-border mb-1">
                      {{ item.title }}
                    </div>
                    
                    <NuxtLink 
                      v-for="child in item.children"
                      :key="child.to"
                      :to="child.to!"
                      class="rounded-md px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent dark:hover:border-slate-700/50 transition-colors whitespace-nowrap"
                      active-class="!bg-accent/10 dark:!bg-slate-800 !text-accent dark:!text-white font-semibold border-slate-200 dark:border-accent-border"
                    >
                      {{ child.title }}
                    </NuxtLink>
                  </div>
                </Transition>
              </div>
            </template>
          </nav>
        </div>

      </div>
    </header>

  </div>
</template>

<style lang="css" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>