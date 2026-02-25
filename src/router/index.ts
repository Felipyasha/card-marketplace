import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

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
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('@/pages/LoginPage.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/pages/RegisterPage.vue'),
        },
        {
          path: 'my-cards',
          name: 'my-cards',
          component: () => import('@/pages/MyCardsPage.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'trades/new',
          name: 'new-trade',
          component: () => import('@/pages/NewTradePage.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }

  if ((to.name === 'login' || to.name === 'register') && auth.isAuthenticated) {
    return { name: 'marketplace' }
  }
})

export default router
