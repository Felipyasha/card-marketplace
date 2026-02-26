<script setup lang="ts">
import type { Card } from '@/types'

const props = defineProps<{
  card: Card
  selectable?: boolean
  selected?: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

function handleClick() {
  if (props.selectable) {
    emit('select', props.card.id)
  }
}
</script>

<template>
  <div
    @click="handleClick"
    :class="[
      'flex flex-col gap-2 rounded-xl overflow-hidden border transition-all',
      selectable ? 'cursor-pointer' : '',
      selected
        ? 'border-orange-500 shadow-lg shadow-orange-500/20 scale-[1.02]'
        : 'border-zinc-700 hover:border-zinc-500',
    ]"
  >
    <!-- Imagem -->
    <div class="relative">
      <img
        :src="card.imageUrl"
        :alt="card.name"
        class="w-full aspect-3/4 object-contain bg-zinc-900"
        loading="lazy"
      />

      <!-- Check de selecionado -->
      <div
        v-if="selected"
        class="absolute inset-0 bg-orange-500/20 flex items-center justify-center"
      >
        <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
          <span class="text-white font-bold text-sm">✓</span>
        </div>
      </div>
    </div>

    <!-- Info -->
    <div class="px-2 pb-2">
      <p class="font-display font-bold text-xs text-white truncate">{{ card.name }}</p>
    </div>

  </div>
</template>
