import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/components/layout/AppLayout.vue'),
      children: [
        {
          path: '',
          name: 'marketplace',
          component: () => import('@/pages/MarketplacePage.vue'),
          meta: { title: 'Marketplace' },
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('@/pages/LoginPage.vue'),
          meta: { title: 'Entrar' },
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/pages/RegisterPage.vue'),
          meta: { title: 'Criar Conta' },
        },
        {
          path: 'my-cards',
          name: 'my-cards',
          component: () => import('@/pages/MyCardsPage.vue'),
          meta: { title: 'Minha Coleção', requiresAuth: true },
        },
        {
          path: 'trades/new',
          name: 'new-trade',
          component: () => import('@/pages/NewTradePage.vue'),
          meta: { title: 'Nova Troca', requiresAuth: true },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
      meta: { title: 'Página não encontrada' },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  document.title = to.meta.title ? `Trocarta – ${to.meta.title}` : 'Trocarta'

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }

  if ((to.name === 'login' || to.name === 'register') && auth.isAuthenticated) {
    return { name: 'marketplace' }
  }
})

export default router
