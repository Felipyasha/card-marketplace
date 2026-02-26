<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { LogOut, Layers, Repeat2, Store, Menu, X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { ref } from 'vue'

const auth = useAuthStore()
const router = useRouter()
const menuOpen = ref(false)

function handleLogout() {
  auth.logout()
  toast.success('Logout realizado!')
  router.push({ name: 'marketplace' })
  menuOpen.value = false
}

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-zinc-800 border-b border-zinc-700 shadow-sm">
    <nav class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

      <!-- Brand -->
      <RouterLink to="/" class="flex items-center shrink-0" @click="closeMenu">
        <img src="/logo.png" alt="Trocarta" class="w-32 h-auto" />
      </RouterLink>

      <!-- Links desktop -->
      <div class="hidden md:flex items-center gap-1 flex-1 ml-6">
        <RouterLink to="/"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded text-base font-display font-bold tracking-wider text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
          active-class="text-orange-500 bg-zinc-700" @click="closeMenu">
          <Store :size="16" />
          Marketplace
        </RouterLink>

        <template v-if="auth.isAuthenticated">
          <RouterLink to="/my-cards"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded text-base font-display font-bold tracking-wider text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
            active-class="text-orange-500 bg-zinc-700" @click="closeMenu">
            <Layers :size="16" />
            Minha Coleção
          </RouterLink>

          <RouterLink to="/trades/new"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded text-base font-display font-bold tracking-wider text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
            active-class="text-orange-500 bg-zinc-700" @click="closeMenu">
            <Repeat2 :size="16" />
            Nova Troca
          </RouterLink>
        </template>
      </div>

      <!-- Auth desktop -->
      <div class="hidden md:flex items-center gap-3 shrink-0">
        <template v-if="auth.isAuthenticated">
          <span class="font-display font-bold text-base tracking-wide text-white max-w-30 truncate">
            {{ auth.user?.name }}
          </span>
          <button @click="handleLogout"
            class="flex items-center justify-center w-8 h-8 rounded border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-400 hover:bg-red-400/10 transition-all">
            <LogOut :size="15" />
          </button>
        </template>

        <template v-else>
          <RouterLink to="/login"
            class="font-display font-bold text-base tracking-wider text-zinc-400 hover:text-white transition-colors">
            Entrar
          </RouterLink>
          <RouterLink to="/register"
            class="font-display font-bold text-base tracking-wider bg-orange-600 text-white px-4 py-1.5 rounded hover:bg-orange-500 transition-colors">
            Registrar
          </RouterLink>
        </template>
      </div>

      <!-- Botão hamburguer mobile -->
      <button :aria-label="menuOpen ? 'Fechar menu' : 'Abrir menu'" :aria-expanded="menuOpen"
        class="md:hidden flex items-center justify-center w-9 h-9 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
        @click="menuOpen = !menuOpen">
        <X v-if="menuOpen" :size="18" />
        <Menu v-else :size="18" />
      </button>

    </nav>

    <!-- Menu mobile -->
    <div v-if="menuOpen" class="md:hidden border-t border-zinc-700 bg-zinc-800 px-6 py-4 flex flex-col gap-2">
      <RouterLink to="/"
        class="flex items-center gap-2 px-3 py-2.5 rounded text-base font-display font-bold tracking-wider text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
        active-class="text-orange-500 bg-zinc-700" @click="closeMenu">
        <Store :size="16" />
        Marketplace
      </RouterLink>

      <template v-if="auth.isAuthenticated">
        <RouterLink to="/my-cards"
          class="flex items-center gap-2 px-3 py-2.5 rounded text-base font-display font-bold tracking-wider text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
          active-class="text-orange-500 bg-zinc-700" @click="closeMenu">
          <Layers :size="16" />
          Minha Coleção
        </RouterLink>

        <RouterLink to="/trades/new"
          class="flex items-center gap-2 px-3 py-2.5 rounded text-base font-display font-bold tracking-wider text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
          active-class="text-orange-500 bg-zinc-700" @click="closeMenu">
          <Repeat2 :size="16" />
          Nova Troca
        </RouterLink>

        <div class="border-t border-zinc-700 mt-2 pt-3 flex items-center justify-between">
          <span class="font-display font-bold text-base text-white truncate">
            {{ auth.user?.name }}
          </span>
          <button aria-label="Sair da conta" @click="handleLogout"
            class="flex items-center justify-center w-8 h-8 rounded border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-400 hover:bg-red-400/10 transition-all">
            Sair
          </button>
        </div>
      </template>

      <template v-else>
        <div class="border-t border-zinc-700 mt-2 pt-3 flex flex-col gap-2">
          <RouterLink to="/login"
            class="text-center font-display font-bold text-base tracking-wider text-zinc-400 border border-zinc-700 px-4 py-2 rounded hover:text-white hover:bg-zinc-700 transition-all"
            @click="closeMenu">
            Entrar
          </RouterLink>
          <RouterLink to="/register"
            class="text-center font-display font-bold text-base tracking-wider bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-500 transition-colors"
            @click="closeMenu">
            Registrar
          </RouterLink>
        </div>
      </template>
    </div>
  </header>
</template>
