<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCardsStore } from '@/stores/cards'
import { useTradesStore } from '@/stores/trades'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { Search, ArrowRight, ChevronLeft, ChevronRight, Repeat2 } from 'lucide-vue-next'
import AppButton from '@/components/ui/AppButton.vue'
import CardTile from '@/components/cards/CardTile.vue'
import { useDebounce } from '@/composables/useDebounce'

type Step = 1 | 2 | 3

const CARDS_PER_PAGE = 12

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
const pageOffering = ref(1)
const pageReceiving = ref(1)

onMounted(async () => {
  try {
    await cardsStore.fetchMyCards()
    await cardsStore.fetchAllCardsAtOnce()
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

const totalPagesOffering = computed(() =>
  Math.ceil(filteredMyCards.value.length / CARDS_PER_PAGE)
)

const totalPagesReceiving = computed(() =>
  Math.ceil(filteredAllCards.value.length / CARDS_PER_PAGE)
)

const paginatedMyCards = computed(() => {
  const start = (pageOffering.value - 1) * CARDS_PER_PAGE
  return filteredMyCards.value.slice(start, start + CARDS_PER_PAGE)
})

const paginatedAllCards = computed(() => {
  const start = (pageReceiving.value - 1) * CARDS_PER_PAGE
  return filteredAllCards.value.slice(start, start + CARDS_PER_PAGE)
})

const visiblePagesOffering = computed(() => {
  const pages: number[] = []
  const total = totalPagesOffering.value
  const current = pageOffering.value
  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)
  if (end - start < 4) start = Math.max(1, end - 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const visiblePagesReceiving = computed(() => {
  const pages: number[] = []
  const total = totalPagesReceiving.value
  const current = pageReceiving.value
  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)
  if (end - start < 4) start = Math.max(1, end - 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

watch(debouncedSearchMy, () => { pageOffering.value = 1 })
watch(debouncedSearchAll, () => { pageReceiving.value = 1 })

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
  <div class="overflow-x-hidden">

    <div class="flex items-center gap-4 mb-4">
      <button @click="router.back()"
        class="flex items-center justify-center w-9 h-9 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">
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

    <div class="flex items-center gap-2 mb-4">
      <div v-for="s in [1, 2, 3]" :key="s" class="flex items-center gap-2">
        <div :class="[
          'flex items-center justify-center w-8 h-8 rounded-full font-display font-bold text-sm transition-all',
          step === s ? 'bg-orange-600 text-white' :
            step > s ? 'bg-green-600 text-white' :
              'bg-zinc-700 text-zinc-400'
        ]">
          {{ step > s ? '✓' : s }}
        </div>
        <span :class="[
          'font-display font-bold text-sm tracking-wider hidden sm:block',
          step === s ? 'text-white' :
            step > s ? 'text-green-500' :
              'text-zinc-500'
        ]">
          {{ s === 1 ? 'Oferecer' : s === 2 ? 'Receber' : 'Revisar' }}
        </span>
        <div v-if="s < 3" class="w-8 h-px bg-zinc-700 mx-1" />
      </div>
    </div>

    <!-- Step 1 -->
    <div v-if="step === 1">
      <div class="mb-3">
        <h2 class="font-display font-bold text-xl text-white mb-1">
          O que você vai oferecer?
          <span v-if="offering.size > 0" class="text-orange-500 text-base ml-2">
            {{ offering.size }} selecionada(s)
          </span>
        </h2>
        <p class="text-zinc-400">Selecione cartas da sua coleção</p>
      </div>

      <div class="relative mb-3">
        <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input v-model="searchMy" type="text" placeholder="Buscar nas minhas cartas..."
          class="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500 transition-all" />
      </div>

      <div v-if="cardsStore.myCardsLoading" class="flex justify-center py-24">
        <div class="w-8 h-8 border-2 border-zinc-700 border-t-orange-500 rounded-full animate-spin" />
      </div>

      <div v-else-if="filteredMyCards.length === 0" class="flex flex-col items-center py-24 gap-4">
        <span class="text-zinc-400 font-display text-lg">Nenhuma carta encontrada.</span>
      </div>

      <template v-else>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          <CardTile v-for="card in paginatedMyCards" :key="card.id" :card="card" :selectable="true"
            :selected="offering.has(card.id)" @select="toggleOffering(card.id)" />
        </div>

        <div v-if="totalPagesOffering > 1" class="flex items-center justify-center gap-1 mt-3 flex-wrap">
          <button @click="pageOffering--" :disabled="pageOffering === 1"
            class="flex items-center justify-center w-8 h-8 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft :size="14" />
          </button>

          <span v-if="(visiblePagesOffering.at(0) ?? 1) > 1" class="flex items-center gap-1">
            <button @click="pageOffering = 1"
              class="w-8 h-8 rounded font-display font-bold text-sm border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">1</button>
            <span v-if="(visiblePagesOffering.at(0) ?? 1) > 2" class="text-zinc-600 px-1">...</span>
          </span>

          <button v-for="page in visiblePagesOffering" :key="page" @click="pageOffering = page" :class="[
            'w-8 h-8 rounded font-display font-bold text-sm transition-all',
            pageOffering === page ? 'bg-orange-600 text-white' : 'border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700'
          ]">{{ page }}</button>

          <span v-if="(visiblePagesOffering.at(-1) ?? totalPagesOffering) < totalPagesOffering" class="flex items-center gap-1">
            <span v-if="(visiblePagesOffering.at(-1) ?? totalPagesOffering) < totalPagesOffering - 1" class="text-zinc-600 px-1">...</span>
            <button @click="pageOffering = totalPagesOffering"
              class="w-8 h-8 rounded font-display font-bold text-sm border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">{{ totalPagesOffering }}</button>
          </span>

          <button @click="pageOffering++" :disabled="pageOffering === totalPagesOffering"
            class="flex items-center justify-center w-8 h-8 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight :size="14" />
          </button>
        </div>
      </template>

      <div class="flex justify-end pt-4 border-t border-zinc-700 mt-4">
        <AppButton variant="primary" size="lg" :disabled="offering.size === 0" @click="step = 2">
          Próximo
          <ArrowRight :size="16" />
        </AppButton>
      </div>
    </div>

    <!-- Step 2 -->
    <div v-if="step === 2">
      <div class="mb-3">
        <h2 class="font-display font-bold text-xl text-white mb-1">
          O que você quer receber?
          <span v-if="receiving.size > 0" class="text-orange-500 text-base ml-2">
            {{ receiving.size }} selecionada(s)
          </span>
        </h2>
        <p class="text-zinc-400">Selecione cartas disponíveis no sistema</p>
      </div>

      <div class="relative mb-3">
        <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input v-model="searchAll" type="text" placeholder="Buscar cartas..."
          class="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500 transition-all" />
      </div>

      <div v-if="cardsStore.allCardsLoading && cardsStore.allCards.length === 0" class="flex justify-center py-24">
        <div class="w-8 h-8 border-2 border-zinc-700 border-t-orange-500 rounded-full animate-spin" />
      </div>

      <div v-else-if="filteredAllCards.length === 0" class="flex flex-col items-center py-24 gap-4">
        <span class="text-zinc-400 font-display text-lg">Nenhuma carta encontrada.</span>
      </div>

      <template v-else>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          <CardTile v-for="card in paginatedAllCards" :key="card.id" :card="card" :selectable="true"
            :selected="receiving.has(card.id)" @select="toggleReceiving(card.id)" />
        </div>

        <div v-if="totalPagesReceiving > 1" class="flex items-center justify-center gap-1 mt-3 flex-wrap">
          <button @click="pageReceiving--" :disabled="pageReceiving === 1"
            class="flex items-center justify-center w-8 h-8 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft :size="14" />
          </button>

          <span v-if="(visiblePagesReceiving.at(0) ?? 1) > 1" class="flex items-center gap-1">
            <button @click="pageReceiving = 1"
              class="w-8 h-8 rounded font-display font-bold text-sm border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">1</button>
            <span v-if="(visiblePagesReceiving.at(0) ?? 1) > 2" class="text-zinc-600 px-1">...</span>
          </span>

          <button v-for="page in visiblePagesReceiving" :key="page" @click="pageReceiving = page" :class="[
            'w-8 h-8 rounded font-display font-bold text-sm transition-all',
            pageReceiving === page ? 'bg-orange-600 text-white' : 'border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700'
          ]">{{ page }}</button>

          <span v-if="(visiblePagesReceiving.at(-1) ?? totalPagesReceiving) < totalPagesReceiving" class="flex items-center gap-1">
            <span v-if="(visiblePagesReceiving.at(-1) ?? totalPagesReceiving) < totalPagesReceiving - 1" class="text-zinc-600 px-1">...</span>
            <button @click="pageReceiving = totalPagesReceiving"
              class="w-8 h-8 rounded font-display font-bold text-sm border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">{{ totalPagesReceiving }}</button>
          </span>

          <button @click="pageReceiving++" :disabled="pageReceiving === totalPagesReceiving"
            class="flex items-center justify-center w-8 h-8 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight :size="14" />
          </button>
        </div>
      </template>

      <div class="flex justify-between pt-4 border-t border-zinc-700 mt-4">
        <AppButton variant="ghost" @click="step = 1">
          <ChevronLeft :size="16" />
          Voltar
        </AppButton>
        <AppButton variant="primary" size="lg" :disabled="receiving.size === 0" @click="step = 3">
          Revisar
          <ArrowRight :size="16" />
        </AppButton>
      </div>
    </div>

    <!-- Step 3 -->
    <div v-if="step === 3">
      <div class="mb-6">
        <h2 class="font-display font-bold text-xl text-white mb-1">Revisar Troca</h2>
        <p class="text-zinc-400">Confirme as cartas antes de publicar</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
          <h3 class="font-display font-bold text-sm uppercase tracking-widest text-green-500 mb-4">
            Você oferece ({{ offering.size }})
          </h3>
          <div class="grid grid-cols-3 gap-3">
            <CardTile v-for="card in cardsStore.myCards.filter(c => offering.has(c.id))" :key="card.id" :card="card" />
          </div>
        </div>

        <div class="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
          <h3 class="font-display font-bold text-sm uppercase tracking-widest text-orange-500 mb-4">
            Você quer ({{ receiving.size }})
          </h3>
          <div class="grid grid-cols-3 gap-3">
            <CardTile v-for="card in cardsStore.allCards.filter(c => receiving.has(c.id))" :key="card.id" :card="card" />
          </div>
        </div>
      </div>

      <div class="flex justify-between pt-4 border-t border-zinc-700">
        <AppButton variant="ghost" @click="step = 2">
          <ChevronLeft :size="16" />
          Voltar
        </AppButton>
        <AppButton variant="primary" size="lg" :loading="submitting" @click="handleSubmit">
          Publicar Troca
        </AppButton>
      </div>
    </div>

  </div>
</template>
