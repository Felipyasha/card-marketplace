<script setup lang="ts">
import { useRouter } from 'vue-router'
import { House } from 'lucide-vue-next'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-zinc-900 flex flex-col items-center justify-center gap-6 text-center px-4">

    <span class="font-display font-bold text-8xl text-orange-500">
      404
    </span>

    <div>
      <h1 class="font-display font-bold text-3xl text-white tracking-wider mb-2">
        Página não encontrada
      </h1>
      <p class="text-zinc-400 max-w-sm">
        A página que você está procurando não existe ou foi removida.
      </p>
    </div>

    <AppButton variant="primary" size="lg" @click="router.push({ name: 'marketplace' })">
      <House :size="18" />
      Voltar ao início
    </AppButton>

  </div>
</template>
