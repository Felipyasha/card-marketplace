<script setup lang="ts">
import { ref } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronDown, ChevronUp, Trash2, Repeat2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useTradesStore } from '@/stores/trades'
import { toast } from 'vue-sonner'
import type { Trade } from '@/types'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps<{ trade: Trade }>()

const auth = useAuthStore()
const tradesStore = useTradesStore()

const expanded = ref(false)
const deleting = ref(false)

const isOwner = props.trade.userId === auth.user?.id

const offering = props.trade.tradeCards.filter(tc => tc.type === 'OFFERING')
const receiving = props.trade.tradeCards.filter(tc => tc.type === 'RECEIVING')

async function handleDelete() {
  if (!confirm('Deseja deletar esta troca?')) return
  deleting.value = true
  try {
    await tradesStore.deleteTrade(props.trade.id)
    toast.success('Troca deletada!')
  } catch {
    toast.error('Erro ao deletar a troca')
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden hover:border-zinc-600 transition-all">

    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-4 border-b border-zinc-700">
      <div class="flex items-center gap-2">
        <Repeat2 :size="16" class="text-orange-500" />
        <span class="font-display font-bold text-white">{{ trade.user.name }}</span>
        <span class="text-zinc-500 text-sm">·</span>
        <span class="text-zinc-500 text-sm">
          {{ formatDistanceToNow(new Date(trade.createdAt), { addSuffix: true, locale: ptBR }) }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <AppButton
          v-if="isOwner"
          variant="danger"
          size="sm"
          :loading="deleting"
          @click="handleDelete"
        >
          <Trash2 :size="14" />
        </AppButton>

        <button
          @click="expanded = !expanded"
          class="flex items-center justify-center w-8 h-8 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
        >
          <ChevronUp v-if="expanded" :size="16" />
          <ChevronDown v-else :size="16" />
        </button>
      </div>
    </div>

    <!-- Preview -->
    <div class="flex items-center gap-4 px-5 py-4">

      <!-- Oferecendo -->
      <div class="flex-1 min-w-0">
        <span class="font-display font-bold text-xs uppercase tracking-widest text-green-500 block mb-2">
          Oferece
        </span>
        <div class="flex items-center">
          <img
            v-for="tc in offering.slice(0, 4)"
            :key="tc.id"
            :src="tc.card.imageUrl"
            :alt="tc.card.name"
            :title="tc.card.name"
            class="w-10 h-14 object-cover rounded border border-zinc-700 -ml-2 first:ml-0 hover:-translate-y-1 transition-transform"
          />
          <span v-if="offering.length > 4" class="text-zinc-500 text-sm ml-2">
            +{{ offering.length - 4 }}
          </span>
        </div>
      </div>

      <!-- Seta -->
      <Repeat2 :size="20" class="text-zinc-600 shrink-0" />

      <!-- Quer receber -->
      <div class="flex-1 min-w-0">
        <span class="font-display font-bold text-xs uppercase tracking-widest text-orange-500 block mb-2">
          Quer
        </span>
        <div class="flex items-center">
          <img
            v-for="tc in receiving.slice(0, 4)"
            :key="tc.id"
            :src="tc.card.imageUrl"
            :alt="tc.card.name"
            :title="tc.card.name"
            class="w-10 h-14 object-cover rounded border border-zinc-700 -ml-2 first:ml-0 hover:-translate-y-1 transition-transform"
          />
          <span v-if="receiving.length > 4" class="text-zinc-500 text-sm ml-2">
            +{{ receiving.length - 4 }}
          </span>
        </div>
      </div>

    </div>

    <!-- Detalhes expandidos -->
    <div v-if="expanded" class="border-t border-zinc-700 px-5 py-4 grid grid-cols-2 gap-6">

      <div>
        <h4 class="font-display font-bold text-sm uppercase tracking-widest text-green-500 mb-3">
          Oferece ({{ offering.length }})
        </h4>
        <div class="grid grid-cols-3 gap-2">
          <div v-for="tc in offering" :key="tc.id" class="flex flex-col gap-1">
            <img
              :src="tc.card.imageUrl"
              :alt="tc.card.name"
              class="w-full aspect-3/4 object-contain"
            />
            <span class="text-xs text-zinc-500 text-center truncate">{{ tc.card.name }}</span>
          </div>
        </div>
      </div>

      <div>
        <h4 class="font-display font-bold text-sm uppercase tracking-widest text-orange-500 mb-3">
          Quer ({{ receiving.length }})
        </h4>
        <div class="grid grid-cols-3 gap-2">
          <div v-for="tc in receiving" :key="tc.id" class="flex flex-col gap-1">
            <img
              :src="tc.card.imageUrl"
              :alt="tc.card.name"
              class="w-full aspect-3/4 object-contain"
            />
            <span class="text-xs text-zinc-500 text-center truncate">{{ tc.card.name }}</span>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>
