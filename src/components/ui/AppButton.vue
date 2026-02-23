<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  fullWidth: false,
  type: 'button',
})
</script>

<template>
  <button
    :type="type"
    :disabled="loading"
    :class="[
      'inline-flex items-center justify-center gap-2 font-display font-bold tracking-wider rounded transition-all',
      'disabled:opacity-50 disabled:cursor-not-allowed',

      // Tamanhos
      size === 'sm' && 'text-sm px-3 py-1.5',
      size === 'md' && 'text-base px-5 py-2',
      size === 'lg' && 'text-lg px-6 py-2.5',

      // Variantes
      variant === 'primary' && 'bg-orange-600 text-white hover:bg-orange-500',
      variant === 'secondary' && 'bg-zinc-700 text-white hover:bg-zinc-600',
      variant === 'ghost' && 'bg-transparent text-zinc-400 border border-zinc-700 hover:text-white hover:bg-zinc-700',
      variant === 'danger' && 'bg-transparent text-red-400 border border-red-400/30 hover:bg-red-400/10',

      // Full width
      fullWidth && 'w-full',
    ]"
  >
    <!-- Spinner de loading -->
    <svg
      v-if="loading"
      class="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>

    <slot />
  </button>
</template>
