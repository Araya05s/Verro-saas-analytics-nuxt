<script setup lang="ts">
import sidebar from '~/components/sidebar.vue';
import topbar from '~/components/topbar.vue';
</script>

<template>
  <div class="flex min-h-screen font-sans">
     <sidebar />

     <div>
      <!-- Top Bar -->
      <topbar />
      
      <!-- Main content -->
      <main class="mx-auto max-w-7xl px-6 py-8">
        <slot />
      </main>
     </div>
  </div>
</template>