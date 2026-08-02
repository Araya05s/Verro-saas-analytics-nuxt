<!-- pages/settings/profile.vue -->
<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()

// Local Reactive Form State initialized from Store
const form = reactive({ ...settingsStore.profile })
const isSavedNotificationVisible = ref(false)

const timezones = [
  'UTC-8 (Pacific Time)',
  'UTC-5 (Eastern Time)',
  'UTC+0 (Greenwich Mean Time)',
  'UTC+1 (Central European Time)',
  'UTC+7 (Western Indonesia Time)'
]

const currencies = [
  'USD ($)',
  'EUR (€)',
  'GBP (£)',
  'IDR (Rp)',
  'JPY (¥)'
]

const languages = [
  'English (US)',
  'Spanish (Español)',
  'German (Deutsch)',
  'French (Français)',
  'Indonesian (Bahasa Indonesia)'
]

const saveProfileSettings = () => {
  settingsStore.updateProfile(form)
  isSavedNotificationVisible.value = true

  setTimeout(() => {
    isSavedNotificationVisible.value = false
  }, 2500)
}
</script>

<template>
  <div class="space-y-6 max-w-4xl">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Company Profile</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Manage organization identities, localization, and currency formats.</p>
      </div>

      <Transition name="toast">
        <div
          v-if="isSavedNotificationVisible"
          class="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3.5 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow-xs"
        >
          <Icon name="heroicons:check-circle-20-solid" class="size-4" />
          Settings persisted to Pinia!
        </div>
      </Transition>
    </div>

    <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
      <div class="space-y-1.5">
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Company Name
        </label>
        <div class="relative">
          <input
            v-model="form.companyName"
            type="text"
            class="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-50 outline-hidden focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-950 transition-all"
            placeholder="Enter organization name"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Timezone Select -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Default Timezone
          </label>
          <select
            v-model="form.timezone"
            class="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-50 outline-hidden focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-950 transition-all"
          >
            <option v-for="tz in timezones" :key="tz" :value="tz">{{ tz }}</option>
          </select>
        </div>

        <!-- Currency Select -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Billing Currency
          </label>
          <select
            v-model="form.currency"
            class="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-50 outline-hidden focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-950 transition-all"
          >
            <option v-for="curr in currencies" :key="curr" :value="curr">{{ curr }}</option>
          </select>
        </div>

        <!-- Language Select -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Interface Language
          </label>
          <select
            v-model="form.language"
            class="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-50 outline-hidden focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-950 transition-all"
          >
            <option v-for="lang in languages" :key="lang" :value="lang">{{ lang }}</option>
          </select>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button
          @click="saveProfileSettings"
          class="rounded-xl bg-slate-900 dark:bg-slate-50 px-5 py-2.5 text-xs font-bold text-white dark:text-slate-900 hover:opacity-90 active:scale-95 transition-all shadow-xs"
        >
          Save Profile Changes
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>