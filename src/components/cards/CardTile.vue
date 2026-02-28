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
  if (props.selectable) emit('select', props.card.id)
}
</script>

<template>
  <div v-if="!selectable"
    class="flex flex-col gap-2 overflow-hidden border border-zinc-700 hover:border-zinc-500 transition-all">
    <img :src="card.imageUrl" :alt="card.name" class="w-full aspect-square bg-zinc-900" loading="lazy" />
    <div class="px-2 pb-2">
      <p class="font-display font-bold text-xs text-white truncate">{{ card.name }}</p>
    </div>
  </div>

  <button v-else type="button" :aria-pressed="selected"
    :aria-label="`${selected ? 'Desselecionar' : 'Selecionar'} carta ${card.name}`" @click="handleClick"
    @keydown.enter="handleClick" @keydown.space.prevent="handleClick" :class="[
      'flex flex-col gap-2 overflow-hidden border transition-all w-full text-left',
      selected
        ? 'border-orange-500 shadow-lg shadow-orange-500/20'
        : 'border-zinc-700 hover:border-zinc-500',
    ]">
    <div class="relative">
      <img :src="card.imageUrl" :alt="card.name" class="w-full aspect-square bg-zinc-900" loading="lazy" />
      <div v-if="selected" class="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
        <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
          <span class="text-white font-bold text-sm">✓</span>
        </div>
      </div>
    </div>
    <div class="px-2 pb-2">
      <p class="font-display font-bold text-xs text-white truncate">{{ card.name }}</p>
    </div>
  </button>
</template>
