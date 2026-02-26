import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import type { User } from '@/types'
import { TOKEN_KEY } from '@/config'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  async function login(email: string, password: string) {
    isLoading.value = true
    try {
      const data = await authApi.login({ email, password })
      token.value = data.token
      user.value = data.user
      localStorage.setItem(TOKEN_KEY, data.token)
    } finally {
      isLoading.value = false
    }
  }

  async function register(name: string, email: string, password: string) {
    isLoading.value = true
    try {
      await authApi.register({ name, email, password })
      await login(email, password)
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  async function refreshUser() {
    if (!token.value) return
    try {
      const data = await authApi.me()
      user.value = { id: data.id, name: data.name, email: data.email }
    } catch {
      logout()
    }
  }

  return { user, token, isLoading, isAuthenticated, login, register, logout, refreshUser }
})
