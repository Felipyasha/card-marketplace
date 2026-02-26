<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCardsStore } from '@/stores/cards'
import { toast } from 'vue-sonner'
import { Search, Plus, Layers, PackageOpen, SearchX } from 'lucide-vue-next'
import AppButton from '@/components/ui/AppButton.vue'
import CardTile from '@/components/cards/CardTile.vue'
import { useDebounce } from '@/composables/useDebounce'

type Tab = 'collection' | 'browse'

const cardsStore = useCardsStore()
const tab = ref<Tab>('collection')
const search = ref('')
const debouncedSearch = useDebounce(search, 300)
const selectedToAdd = ref<Set<string>>(new Set())
const adding = ref(false)

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
}
</script>

<template>
  <div>

    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
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

    <!-- Tabs -->
    <div class="flex border-b border-zinc-700 mb-6">
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

    <!-- Search -->
    <div class="relative mb-6">
      <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
      <input v-model="search" type="text"
        :placeholder="tab === 'collection' ? 'Buscar nas minhas cartas...' : 'Buscar cartas...'"
        class="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-zinc-500 outline-none focus:border-orange-500 transition-all" />
    </div>

    <!-- Aba: Minhas Cartas -->
    <template v-if="tab === 'collection'">

      <!-- Loading -->
      <div v-if="cardsStore.myCardsLoading" class="flex justify-center py-24">
        <div class="w-8 h-8 border-2 border-zinc-700 border-t-orange-500 rounded-full animate-spin" />
      </div>
      
      <!-- Vazio -->
      <div v-else-if="filteredMyCards.length === 0" class="flex flex-col items-center py-24 gap-4">

        <!-- Coleção vazia -->
        <template v-if="!search">
          <PackageOpen :size="64" class="text-zinc-600" />
          <p class="text-zinc-400 font-display text-lg">Sua coleção está vazia.</p>
          <AppButton variant="primary" @click="switchTab('browse')">
            Adicionar Cartas
          </AppButton>
        </template>

        <!-- Busca sem resultado -->
        <template v-else>
          <SearchX :size="64" class="text-zinc-600" />
          <p class="text-zinc-400 font-display text-lg">Nenhuma carta encontrada.</p>
        </template>

      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <CardTile v-for="card in filteredMyCards" :key="card.id" :card="card" />
      </div>

    </template>

    <!-- Aba: Adicionar Cartas -->
    <template v-if="tab === 'browse'">

      <!-- Barra de seleção -->
      <div v-if="selectedToAdd.size > 0"
        class="flex items-center justify-between bg-zinc-800 border border-orange-500/30 rounded-lg px-4 py-3 mb-4">
        <span class="font-display font-bold text-orange-500">
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

      <!-- Loading, Vazio e Grid num mesmo bloco -->
      <div>
        <!-- Loading -->
        <div v-if="cardsStore.allCardsLoading && cardsStore.allCards.length === 0" class="flex justify-center py-24">
          <div class="w-8 h-8 border-2 border-zinc-700 border-t-orange-500 rounded-full animate-spin" />
        </div>

        <!-- Vazio -->
        <div v-else-if="filteredAllCards.length === 0" class="flex flex-col items-center py-24 gap-4">
          <SearchX :size="64" class="text-zinc-600" />
          <p class="text-zinc-400 font-display text-lg">Nenhuma carta encontrada.</p>
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <CardTile v-for="card in filteredAllCards" :key="card.id" :card="card" :selectable="true"
            :selected="selectedToAdd.has(card.id)" @select="toggleSelect(card.id)" />
        </div>
      </div>

      <!-- Load more -->
      <div v-if="cardsStore.allCardsMore" class="flex justify-center mt-6">
        <AppButton variant="ghost" :loading="cardsStore.allCardsLoading" @click="cardsStore.fetchMoreCards()">
          Carregar mais
        </AppButton>
      </div>

    </template>

  </div>
</template>
