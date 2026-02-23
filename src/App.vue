<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>

<template>
  <RouterView />
  <Toaster
    position="top-right"
    :toastOptions="{
      style: {
        background: '#0f0b1a',
        color: '#f0e6ff',
        border: '1px solid rgba(139, 92, 246, 0.25)',
      }
    }"
  />
</template>
