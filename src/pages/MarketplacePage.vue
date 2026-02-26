<script setup lang="ts">
import { onMounted } from 'vue'
import { useTradesStore } from '@/stores/trades'
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'
import { RefreshCw, Plus } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import TradeCard from '@/components/trades/TradeCard.vue'
import AppButton from '@/components/ui/AppButton.vue'

const tradesStore = useTradesStore()
const auth = useAuthStore()

onMounted(async () => {
  try {
    await tradesStore.fetchTrades(1)
  } catch {
    toast.error('Erro ao carregar as trocas')
  }
})
</script>

<template>
  <div>

    <!-- Hero -->
    <div class="text-center py-12 border-b border-zinc-800 mb-8">
      <h1 class="font-display font-bold text-4xl text-white tracking-wider mb-3">
        Marketplace
      </h1>
      <p class="text-zinc-400 text-lg mb-6 max-w-md mx-auto">
        Encontre trocas abertas e negocie suas cartas com outros jogadores
      </p>
      <RouterLink v-if="auth.isAuthenticated" to="/trades/new">
        <AppButton variant="primary" size="lg">
          <Plus :size="18" />
          Nova Troca
        </AppButton>
      </RouterLink>
      <RouterLink v-else to="/register">
        <AppButton variant="primary" size="lg">
          Cadastre-se para trocar
        </AppButton>
      </RouterLink>
    </div>

    <!-- Barra de stats -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <span class="font-display font-bold text-2xl text-orange-500">
          {{ tradesStore.trades.length }}
        </span>
        <span class="text-zinc-400 text-sm uppercase tracking-widest font-display">
          trocas abertas
        </span>
      </div>

      <button
        @click="tradesStore.fetchTrades(1)"
        :disabled="tradesStore.loading"
        class="flex items-center gap-2 text-sm font-display font-bold text-zinc-400 border border-zinc-700 px-3 py-1.5 rounded hover:text-white hover:bg-zinc-700 transition-all disabled:opacity-50"
      >
        <RefreshCw
          :size="14"
          :class="tradesStore.loading ? 'animate-spin' : ''"
        />
        Atualizar
      </button>
    </div>

    <!-- Loading -->
    <div
      v-if="tradesStore.loading && tradesStore.trades.length === 0"
      class="flex flex-col items-center justify-center py-24 gap-4"
    >
      <RefreshCw :size="32" class="animate-spin text-orange-500" />
      <span class="text-zinc-400 font-display">Carregando trocas...</span>
    </div>

    <!-- Vazio -->
    <div
      v-else-if="tradesStore.trades.length === 0"
      class="flex flex-col items-center justify-center py-24 gap-4"
    >
      <span class="text-6xl">🃏</span>
      <p class="text-zinc-400 font-display text-lg">Nenhuma troca disponível ainda.</p>
      <RouterLink v-if="auth.isAuthenticated" to="/trades/new">
        <AppButton variant="primary">Seja o primeiro a trocar</AppButton>
      </RouterLink>
    </div>

    <!-- Lista de trocas -->
    <div v-else class="flex flex-col gap-4">
      <TradeCard
        v-for="trade in tradesStore.trades"
        :key="trade.id"
        :trade="trade"
      />

      <!-- Load more -->
      <div v-if="tradesStore.more" class="flex justify-center mt-4">
        <AppButton
          variant="ghost"
          :loading="tradesStore.loading"
          @click="tradesStore.fetchMoreTrades()"
        >
          Carregar mais
        </AppButton>
      </div>
    </div>

  </div>
</template>
