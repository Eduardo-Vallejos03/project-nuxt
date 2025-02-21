<template>
  <div class="min-h-screen bg-gray-50">
      <div class="p-6 font-bold text-2xl flex justify-center border-b">
        <a href="/">PROJECT NUXT - TT</a>
      </div>

    <!-- Contenido Principal de las páginas -->
    <main class="p-6">
      <NuxtPage :key="layoutKey"/>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const status = ref('default')
const layoutKey = computed(() => `layout-${status.value}`);
const items = ref([
  { label: 'Inicio', icon: 'pi pi-home', route: '/' },
]);
</script>

