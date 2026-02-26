<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCardsStore } from '@/stores/cards'
import { useTradesStore } from '@/stores/trades'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { Search, ArrowRight, ChevronLeft, Repeat2 } from 'lucide-vue-next'
import AppButton from '@/components/ui/AppButton.vue'
import CardTile from '@/components/cards/CardTile.vue'
import { useDebounce } from '@/composables/useDebounce'

type Step = 1 | 2 | 3

const router = useRouter()
const cardsStore = useCardsStore()
const tradesStore = useTradesStore()

const step = ref<Step>(1)
const offering = ref<Set<string>>(new Set())
const receiving = ref<Set<string>>(new Set())
const searchMy = ref('')
const searchAll = ref('')
const debouncedSearchMy = useDebounce(searchMy, 300)
const debouncedSearchAll = useDebounce(searchAll, 300)
const submitting = ref(false)

onMounted(async () => {
  try {
    await cardsStore.fetchMyCards()
    await cardsStore.fetchAllCards(1)
  } catch {
    toast.error('Erro ao carregar cartas')
  }
})

const myCardIds = computed(() => new Set(cardsStore.myCards.map(c => c.id)))

const filteredMyCards = computed(() =>
  cardsStore.myCards.filter(c =>
    c.name.toLowerCase().includes(debouncedSearchMy.value.toLowerCase())
  )
)

const filteredAllCards = computed(() =>
  cardsStore.allCards
    .filter(c => !myCardIds.value.has(c.id))
    .filter(c => c.name.toLowerCase().includes(debouncedSearchAll.value.toLowerCase()))
)

function toggleOffering(id: string) {
  const next = new Set(offering.value)
  next.has(id) ? next.delete(id) : next.add(id)
  offering.value = next
}

function toggleReceiving(id: string) {
  const next = new Set(receiving.value)
  next.has(id) ? next.delete(id) : next.add(id)
  receiving.value = next
}

async function handleSubmit() {
  if (offering.value.size === 0 || receiving.value.size === 0) {
    toast.error('Selecione ao menos uma carta para oferecer e uma para receber')
    return
  }
  submitting.value = true
  try {
    const cards = [
      ...[...offering.value].map(id => ({ cardId: id, type: 'OFFERING' as const })),
      ...[...receiving.value].map(id => ({ cardId: id, type: 'RECEIVING' as const })),
    ]
    await tradesStore.createTrade({ cards })
    toast.success('Troca criada com sucesso!')
    router.push({ name: 'marketplace' })
  } catch {
    toast.error('Erro ao criar troca')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>

    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <button
        @click="router.back()"
        class="flex items-center justify-center w-9 h-9 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
      >
        <ChevronLeft :size="18" />
      </button>
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center w-12 h-12 bg-orange-600/10 border border-orange-600/20 rounded-xl">
          <Repeat2 :size="22" class="text-orange-500" />
        </div>
        <div>
          <h1 class="font-display font-bold text-2xl text-white tracking-wider">Nova Troca</h1>
          <p class="text-zinc-400">Selecione as cartas para oferecer e receber</p>
        </div>
      </div>
    </div>

    <!-- Stepper -->
    <div class="flex items-center gap-2 mb-8">
      <div
        v-for="s in [1, 2, 3]"
        :key="s"
        class="flex items-center gap-2"
      >
        <div :class="[
          'flex items-center justify-center w-8 h-8 rounded-full font-display font-bold text-sm transition-all',
          step === s ? 'bg-orange-600 text-white' :
          step > s  ? 'bg-green-600 text-white' :
                      'bg-zinc-700 text-zinc-400'
        ]">
          {{ step > s ? '✓' : s }}
        </div>
        <span :class="[
          'font-display font-bold text-sm tracking-wider hidden sm:block',
          step === s ? 'text-white' :
          step > s  ? 'text-green-500' :
                      'text-zinc-500'
        ]">
          {{ s === 1 ? 'Oferecer' : s === 2 ? 'Receber' : 'Revisar' }}
        </span>
        <div v-if="s < 3" class="w-8 h-px bg-zinc-700 mx-1" />
      </div>
    </div>

    <!-- Step 1: Cartas para oferecer -->
    <div v-if="step === 1">
      <div class="mb-6">
        <h2 class="font-display font-bold text-xl text-white mb-1">
          O que você vai oferecer?
          <span v-if="offering.size > 0" class="text-orange-500 text-base ml-2">
            {{ offering.size }} selecionada(s)
          </span>
        </h2>
        <p class="text-zinc-400">Selecione cartas da sua coleção</p>
      </div>

      <!-- Search -->
      <div class="relative mb-6">
        <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          v-model="searchMy"
          type="text"
          placeholder="Buscar nas minhas cartas..."
          class="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-zinc-500 outline-none focus:border-orange-500 transition-all"
        />
      </div>

      <!-- Loading -->
      <div v-if="cardsStore.myCardsLoading" class="flex justify-center py-24">
        <div class="w-8 h-8 border-2 border-zinc-700 border-t-orange-500 rounded-full animate-spin" />
      </div>

      <!-- Vazio -->
      <div v-else-if="filteredMyCards.length === 0" class="flex flex-col items-center py-24 gap-4">
        <span class="text-zinc-400 font-display text-lg">Nenhuma carta encontrada.</span>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
        <CardTile
          v-for="card in filteredMyCards"
          :key="card.id"
          :card="card"
          :selectable="true"
          :selected="offering.has(card.id)"
          @select="toggleOffering(card.id)"
        />
      </div>

      <div class="flex justify-end pt-4 border-t border-zinc-700">
        <AppButton
          variant="primary"
          size="lg"
          :disabled="offering.size === 0"
          @click="step = 2"
        >
          Próximo
          <ArrowRight :size="16" />
        </AppButton>
      </div>
    </div>

    <!-- Step 2: Cartas para receber -->
    <div v-if="step === 2">
      <div class="mb-6">
        <h2 class="font-display font-bold text-xl text-white mb-1">
          O que você quer receber?
          <span v-if="receiving.size > 0" class="text-orange-500 text-base ml-2">
            {{ receiving.size }} selecionada(s)
          </span>
        </h2>
        <p class="text-zinc-400">Selecione cartas disponíveis no sistema</p>
      </div>

      <!-- Search -->
      <div class="relative mb-6">
        <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          v-model="searchAll"
          type="text"
          placeholder="Buscar cartas..."
          class="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-zinc-500 outline-none focus:border-orange-500 transition-all"
        />
      </div>

      <!-- Loading -->
      <div v-if="cardsStore.allCardsLoading && cardsStore.allCards.length === 0" class="flex justify-center py-24">
        <div class="w-8 h-8 border-2 border-zinc-700 border-t-orange-500 rounded-full animate-spin" />
      </div>

      <!-- Vazio -->
      <div v-else-if="filteredAllCards.length === 0" class="flex flex-col items-center py-24 gap-4">
        <span class="text-zinc-400 font-display text-lg">Nenhuma carta encontrada.</span>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
        <CardTile
          v-for="card in filteredAllCards"
          :key="card.id"
          :card="card"
          :selectable="true"
          :selected="receiving.has(card.id)"
          @select="toggleReceiving(card.id)"
        />
      </div>

      <!-- Load more -->
      <div v-if="cardsStore.allCardsMore" class="flex justify-center mb-6">
        <AppButton variant="ghost" :loading="cardsStore.allCardsLoading" @click="cardsStore.fetchMoreCards()">
          Carregar mais
        </AppButton>
      </div>

      <div class="flex justify-between pt-4 border-t border-zinc-700">
        <AppButton variant="ghost" @click="step = 1">
          <ChevronLeft :size="16" />
          Voltar
        </AppButton>
        <AppButton
          variant="primary"
          size="lg"
          :disabled="receiving.size === 0"
          @click="step = 3"
        >
          Revisar
          <ArrowRight :size="16" />
        </AppButton>
      </div>
    </div>

    <!-- Step 3: Revisar -->
    <div v-if="step === 3">
      <div class="mb-6">
        <h2 class="font-display font-bold text-xl text-white mb-1">Revisar Troca</h2>
        <p class="text-zinc-400">Confirme as cartas antes de publicar</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        <!-- Oferecendo -->
        <div class="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
          <h3 class="font-display font-bold text-sm uppercase tracking-widest text-green-500 mb-4">
            Você oferece ({{ offering.size }})
          </h3>
          <div class="grid grid-cols-3 gap-3">
            <CardTile
              v-for="card in cardsStore.myCards.filter(c => offering.has(c.id))"
              :key="card.id"
              :card="card"
            />
          </div>
        </div>

        <!-- Recebendo -->
        <div class="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
          <h3 class="font-display font-bold text-sm uppercase tracking-widest text-orange-500 mb-4">
            Você quer ({{ receiving.size }})
          </h3>
          <div class="grid grid-cols-3 gap-3">
            <CardTile
              v-for="card in cardsStore.allCards.filter(c => receiving.has(c.id))"
              :key="card.id"
              :card="card"
            />
          </div>
        </div>

      </div>

      <div class="flex justify-between pt-4 border-t border-zinc-700">
        <AppButton variant="ghost" @click="step = 2">
          <ChevronLeft :size="16" />
          Voltar
        </AppButton>
        <AppButton
          variant="primary"
          size="lg"
          :loading="submitting"
          @click="handleSubmit"
        >
          Publicar Troca
        </AppButton>
      </div>
    </div>

  </div>
</template>
