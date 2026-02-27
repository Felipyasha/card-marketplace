<script setup lang="ts">
import AppNavbar from './AppNavbar.vue'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const auth = useAuthStore()

onMounted(() => {
  if (auth.isAuthenticated) {
    auth.refreshUser()
  }
})
</script>

<template>
  <div class="min-h-screen bg-zinc-900 text-white flex flex-col">
    <AppNavbar />
    <main class="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
      <RouterView />
    </main>
    <footer
      class="border-t border-zinc-700 bg-zinc-800 py-6 text-center font-display font-bold text-base tracking-widest text-zinc-300 ">
      Trocarta © 2026 — Troque com honra
    </footer>
  </div>
</template>
