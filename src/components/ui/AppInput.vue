<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string
  error?: string
  hint?: string
  inputId?: string
}

const props = defineProps<Props>()
const model = defineModel<string>()

const id = computed(() =>
  props.inputId ?? `input-${Math.random().toString(36).slice(2, 7)}`
)
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="id"
      class="font-display font-bold text-sm tracking-wider text-zinc-400"
    >
      {{ label }}
    </label>

    <input
      v-bind="$attrs"
      :id="id"
      v-model="model"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : hint ? `${id}-hint` : undefined"
      :class="[
        'w-full bg-zinc-800 border rounded px-4 py-2.5 text-base text-white placeholder-zinc-600 outline-none transition-all',
        error
          ? 'border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400'
          : 'border-zinc-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
      ]"
    />

    <span v-if="error" :id="`${id}-error`" class="text-sm text-red-400">{{ error }}</span>
    <span v-else-if="hint" :id="`${id}-hint`" class="text-sm text-zinc-500">{{ hint }}</span>
  </div>
</template>
