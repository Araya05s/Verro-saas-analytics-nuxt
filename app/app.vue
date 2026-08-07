<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.applyThemeToDOM()
})

useHead({
  title: 'Veero | Front-End Saas Analytics',
  meta: [
    { name: 'description', content: 'A high-performance, responsive SaaS analytics platform featuring real-time data visualization filtering with state persistence and modular composable architecture. Built with Nuxt 4, Tailwind CSS, and Pinia.' },
  ],
  style: [
    {
      id: 'dynamic-accent-vars',
      innerHTML: computed(() => `
        :root {
          --color-accent: ${settingsStore.activeAccentKey.hex};
          --color-accent-hover: ${settingsStore.activeAccentKey.hoverHex};
          --color-accent-light: ${settingsStore.activeAccentKey.lightHex};
          --color-accent-border: ${settingsStore.activeAccentKey.borderHex};
        }
      `)
    }
  ]
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
