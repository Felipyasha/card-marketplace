<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'

defineProps<{
  title: string
  message: string
  confirmLabel?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <!-- Backdrop -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    @click.self="emit('cancel')">
    <!-- Modal -->
    <div class="bg-zinc-800 border border-zinc-700 rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl">


      <!-- Título -->
      <h3 class="font-display font-bold text-lg text-white text-center tracking-wider mb-2">
        {{ title }}
      </h3>

      <!-- Mensagem -->
      <p class="text-zinc-400 text-center mb-6">
        {{ message }}
      </p>

      <!-- Botões -->
      <div class="flex gap-3">
        <AppButton variant="ghost" :full-width="true" @click="emit('cancel')">
          Cancelar
        </AppButton>
        <AppButton variant="danger" :full-width="true" :loading="loading" @click="emit('confirm')">
          {{ confirmLabel ?? 'Confirmar' }}
        </AppButton>
      </div>

    </div>
  </div>
</template>
