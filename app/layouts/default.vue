<script setup lang="ts">
import sidebar from '~/components/sidebar.vue';
import topbar from '~/components/topbar.vue';
</script>

<template>
  <div class="flex min-h-screen font-sans">
     <sidebar />

    <!-- Top Bar -->
    <div class="flex-1 flex flex-col min-w-0">
      <topbar />
      
      <!-- Main content -->
      <main class="flex-1 w-full">
        <div class="mx-auto max-w-6xl px-4 sm:px-6 py-8 overflow-x-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>