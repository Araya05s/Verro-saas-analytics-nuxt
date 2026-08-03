<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.applyThemeToDOM()
})

useHead({
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
