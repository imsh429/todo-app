// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('@/views/CalendarView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Firebase 인증 상태 초기화 완료 대기
let authReady = false
let currentUser = null

onAuthStateChanged(auth, (user) => {
  currentUser = user
  authReady = true
})

// 라우트 가드: 인증 체크
router.beforeEach(async (to, from, next) => {
  // Firebase 인증 초기화 대기
  if (!authReady) {
    await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, () => {
        unsubscribe()
        resolve()
      })
    })
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)

  if (requiresAuth && !currentUser) {
    next('/login')
  } else if (requiresGuest && currentUser) {
    next('/')
  } else {
    next()
  }
})

export default router
