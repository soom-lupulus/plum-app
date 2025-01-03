import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    }
  ]
})

router.beforeEach(async (to, from) => {
  const token = localStorage.getItem('token')
  if (to.name === 'login') {
    if (token) return { name: 'home' }
  } else {
    if (!token) return { name: 'login' }
  }
})

export default router
