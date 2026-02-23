<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>

<template>
  <RouterView />
  <Toaster
    position="top-right"
    :toastOptions="{
      style: {
        background: '#2a2a2a',
        color: '#ffffff',
        border: '1px solid #3a3a3a',
      }
    }"
  />
</template>
