// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth, googleProvider } from '@/firebase/config'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)

  // 인증 상태 감지
  const initAuth = () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
    })
  }

  // Google 로그인
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      user.value = result.user
      router.push('/')
      return { success: true }
    } catch (error) {
      console.error('로그인 실패:', error)
      return { success: false, error: error.message }
    }
  }

  // 로그아웃
  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      user.value = null
      router.push('/login')
      return { success: true }
    } catch (error) {
      console.error('로그아웃 실패:', error)
      return { success: false, error: error.message }
    }
  }

  return {
    user,
    loading,
    initAuth,
    signInWithGoogle,
    signOut
  }
})
