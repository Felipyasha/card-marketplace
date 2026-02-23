<script setup lang="ts">
interface Props {
  label?: string
  error?: string
  hint?: string
}

defineProps<Props>()

const model = defineModel<string>()
</script>

<template>
  <div class="flex flex-col gap-1.5">

    <label v-if="label" class="font-display font-bold text-sm tracking-wider text-zinc-400">
      {{ label }}
    </label>

    <input
      v-bind="$attrs"
      v-model="model"
      :class="[
        'w-full bg-zinc-800 border rounded px-4 py-2.5 text-base text-white placeholder-zinc-600 outline-none transition-all',
        error
          ? 'border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400'
          : 'border-zinc-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
      ]"
    />

    <span v-if="error" class="text-sm text-red-400">{{ error }}</span>
    <span v-else-if="hint" class="text-sm text-zinc-500">{{ hint }}</span>

  </div>
</template>
