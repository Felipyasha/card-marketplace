<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCardsStore } from '@/stores/cards'
import { toast } from 'vue-sonner'
import { Search, Plus, Layers, PackageOpen, SearchX, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import AppButton from '@/components/ui/AppButton.vue'
import CardTile from '@/components/cards/CardTile.vue'
import { useDebounce } from '@/composables/useDebounce'

type Tab = 'collection' | 'browse'

const CARDS_PER_PAGE = 12

const cardsStore = useCardsStore()
const tab = ref<Tab>('collection')
const search = ref('')
const debouncedSearch = useDebounce(search, 300)
const selectedToAdd = ref<Set<string>>(new Set())
const adding = ref(false)
const currentPage = ref(1)
const currentPageMy = ref(1)

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
    c.name.toLowerCase().includes(debouncedSearch.value.toLowerCase())
  )
)

const availableCards = computed(() =>
  cardsStore.allCards.filter(c => !myCardIds.value.has(c.id))
)

const filteredAllCards = computed(() =>
  availableCards.value.filter(c =>
    c.name.toLowerCase().includes(debouncedSearch.value.toLowerCase())
  )
)

const totalPages = computed(() =>
  Math.ceil(filteredAllCards.value.length / CARDS_PER_PAGE)
)

const totalPagesMy = computed(() =>
  Math.ceil(filteredMyCards.value.length / CARDS_PER_PAGE)
)

const paginatedAllCards = computed(() => {
  const start = (currentPage.value - 1) * CARDS_PER_PAGE
  return filteredAllCards.value.slice(start, start + CARDS_PER_PAGE)
})

const paginatedMyCards = computed(() => {
  const start = (currentPageMy.value - 1) * CARDS_PER_PAGE
  return filteredMyCards.value.slice(start, start + CARDS_PER_PAGE)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = currentPage.value
  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)
  if (end - start < 4) start = Math.max(1, end - 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const visiblePagesMy = computed(() => {
  const pages: number[] = []
  const total = totalPagesMy.value
  const current = currentPageMy.value
  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)
  if (end - start < 4) start = Math.max(1, end - 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

watch(debouncedSearch, () => {
  currentPage.value = 1
  currentPageMy.value = 1
})

function toggleSelect(id: string) {
  const next = new Set(selectedToAdd.value)
  next.has(id) ? next.delete(id) : next.add(id)
  selectedToAdd.value = next
}

async function handleAddCards() {
  if (selectedToAdd.value.size === 0) return
  adding.value = true
  try {
    await cardsStore.addCardsToMyCollection([...selectedToAdd.value])
    toast.success(`${selectedToAdd.value.size} carta(s) adicionada(s)!`)
    selectedToAdd.value = new Set()
    tab.value = 'collection'
  } catch {
    toast.error('Erro ao adicionar cartas')
  } finally {
    adding.value = false
  }
}

function switchTab(newTab: Tab) {
  tab.value = newTab
  search.value = ''
  selectedToAdd.value = new Set()
  currentPage.value = 1
  currentPageMy.value = 1
}
</script>

<template>
  <div class="overflow-x-hidden">

    <div class="flex items-center gap-4 mb-4">
      <div class="flex items-center justify-center w-12 h-12 bg-orange-600/10 border border-orange-600/20 rounded-xl">
        <Layers :size="22" class="text-orange-500" />
      </div>
      <div>
        <h1 class="font-display font-bold text-2xl text-white tracking-wider">
          Minha Coleção
        </h1>
        <p class="text-zinc-400">
          {{ cardsStore.myCards.length }} carta(s) na sua coleção
        </p>
      </div>
    </div>

    <div class="flex border-b border-zinc-700 mb-3">
      <button @click="switchTab('collection')" :class="[
        'flex items-center gap-2 px-4 py-3 font-display font-bold text-sm tracking-wider border-b-2 transition-all',
        tab === 'collection'
          ? 'text-orange-500 border-orange-500'
          : 'text-zinc-400 border-transparent hover:text-white'
      ]">
        <Layers :size="15" />
        Minhas Cartas ({{ cardsStore.myCards.length }})
      </button>
      <button @click="switchTab('browse')" :class="[
        'flex items-center gap-2 px-4 py-3 font-display font-bold text-sm tracking-wider border-b-2 transition-all',
        tab === 'browse'
          ? 'text-orange-500 border-orange-500'
          : 'text-zinc-400 border-transparent hover:text-white'
      ]">
        <Plus :size="15" />
        Adicionar Cartas
      </button>
    </div>

    <div class="relative mb-3">
      <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
      <input v-model="search" type="text"
        :placeholder="tab === 'collection' ? 'Buscar nas minhas cartas...' : 'Buscar cartas...'"
        class="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500 transition-all" />
    </div>

    <template v-if="tab === 'collection'">

      <div v-if="cardsStore.myCardsLoading" class="flex justify-center py-24">
        <div class="w-8 h-8 border-2 border-zinc-700 border-t-orange-500 rounded-full animate-spin" />
      </div>

      <div v-else-if="filteredMyCards.length === 0" class="flex flex-col items-center py-24 gap-4">
        <template v-if="!search">
          <PackageOpen :size="64" class="text-zinc-600" />
          <p class="text-zinc-400 font-display text-lg">Sua coleção está vazia.</p>
          <AppButton variant="primary" @click="switchTab('browse')">
            Adicionar Cartas
          </AppButton>
        </template>
        <template v-else>
          <SearchX :size="64" class="text-zinc-600" />
          <p class="text-zinc-400 font-display text-lg">Nenhuma carta encontrada.</p>
        </template>
      </div>

      <template v-else>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          <CardTile v-for="card in paginatedMyCards" :key="card.id" :card="card" />
        </div>

        <div v-if="totalPagesMy > 1" class="flex items-center justify-center gap-1 mt-3 flex-wrap">
          <button @click="currentPageMy--" :disabled="currentPageMy === 1"
            class="flex items-center justify-center w-8 h-8 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft :size="14" />
          </button>

          <span v-if="(visiblePagesMy.at(0) ?? 1) > 1" class="flex items-center gap-1">
            <button @click="currentPageMy = 1"
              class="w-8 h-8 rounded font-display font-bold text-sm border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">1</button>
            <span v-if="(visiblePagesMy.at(0) ?? 1) > 2" class="text-zinc-600 px-1">...</span>
          </span>

          <button v-for="page in visiblePagesMy" :key="page" @click="currentPageMy = page" :class="[
            'w-8 h-8 rounded font-display font-bold text-sm transition-all',
            currentPageMy === page ? 'bg-orange-600 text-white' : 'border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700'
          ]">{{ page }}</button>

          <span v-if="(visiblePagesMy.at(-1) ?? totalPagesMy) < totalPagesMy" class="flex items-center gap-1">
            <span v-if="(visiblePagesMy.at(-1) ?? totalPagesMy) < totalPagesMy - 1"
              class="text-zinc-600 px-1">...</span>
            <button @click="currentPageMy = totalPagesMy"
              class="w-8 h-8 rounded font-display font-bold text-sm border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">{{
                totalPagesMy }}</button>
          </span>

          <button @click="currentPageMy++" :disabled="currentPageMy === totalPagesMy"
            class="flex items-center justify-center w-8 h-8 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight :size="14" />
          </button>
        </div>
      </template>

    </template>

    <template v-if="tab === 'browse'">

      <div v-if="selectedToAdd.size > 0"
        class="flex items-center justify-between bg-zinc-800 border border-orange-500/30 rounded-lg px-4 py-2 mb-3">
        <span class="font-display font-bold text-sm text-orange-500">
          {{ selectedToAdd.size }} carta(s) selecionada(s)
        </span>
        <div class="flex gap-2">
          <AppButton variant="ghost" size="sm" @click="selectedToAdd = new Set()">
            Limpar
          </AppButton>
          <AppButton variant="primary" size="sm" :loading="adding" @click="handleAddCards">
            Adicionar à Coleção
          </AppButton>
        </div>
      </div>

      <div v-if="cardsStore.allCardsLoading && cardsStore.allCards.length === 0" class="flex justify-center py-24">
        <div class="w-8 h-8 border-2 border-zinc-700 border-t-orange-500 rounded-full animate-spin" />
      </div>

      <div v-else-if="filteredAllCards.length === 0" class="flex flex-col items-center py-24 gap-4">
        <SearchX :size="64" class="text-zinc-600" />
        <p class="text-zinc-400 font-display text-lg">Nenhuma carta encontrada.</p>
      </div>

      <template v-else>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          <CardTile v-for="card in paginatedAllCards" :key="card.id" :card="card" :selectable="true"
            :selected="selectedToAdd.has(card.id)" @select="toggleSelect(card.id)" />
        </div>

        <div v-if="totalPages > 1" class="flex items-center justify-center gap-1 mt-3 flex-wrap">
          <button @click="currentPage--" :disabled="currentPage === 1"
            class="flex items-center justify-center w-8 h-8 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft :size="14" />
          </button>

          <span v-if="(visiblePages.at(0) ?? 1) > 1" class="flex items-center gap-1">
            <button @click="currentPage = 1"
              class="w-8 h-8 rounded font-display font-bold text-sm border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">
              1
            </button>
            <span v-if="(visiblePages.at(0) ?? 1) > 2" class="text-zinc-600 px-1">...</span>
          </span>

          <button v-for="page in visiblePages" :key="page" @click="currentPage = page" :class="[
            'w-8 h-8 rounded font-display font-bold text-sm transition-all',
            currentPage === page
              ? 'bg-orange-600 text-white'
              : 'border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700'
          ]">
            {{ page }}
          </button>

          <span v-if="(visiblePages.at(-1) ?? totalPages) < totalPages" class="flex items-center gap-1">
            <span v-if="(visiblePages.at(-1) ?? totalPages) < totalPages - 1" class="text-zinc-600 px-1">...</span>
            <button @click="currentPage = totalPages"
              class="w-8 h-8 rounded font-display font-bold text-sm border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">
              {{ totalPages }}
            </button>
          </span>

          <button @click="currentPage++" :disabled="currentPage === totalPages"
            class="flex items-center justify-center w-8 h-8 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight :size="14" />
          </button>
        </div>
      </template>

    </template>

  </div>
</template>
