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
  <div class="min-h-screen bg-[#1e1e1e] text-white flex flex-col">
    <AppNavbar />
    <main class="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
      <RouterView />
    </main>
    <footer class="border-t border-[#3a3a3a] bg-[#2a2a2a] py-6 text-center font-display text-base tracking-widest text-[#b0b0b0]">
      Trocarta © 2024 — Troque com honra
    </footer>
  </div>
</template>
