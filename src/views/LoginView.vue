<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <i class="pi pi-check-circle" style="font-size: 3rem; color: #3B82F6;"></i>
        <h1>TaskSync</h1>
        <p>할일 관리 & 캘린더 앱</p>
      </div>

      <button
        class="google-login-btn"
        @click="handleGoogleLogin"
        :disabled="loading"
      >
        <i class="pi pi-google"></i>
        <span>Google로 로그인</span>
      </button>

      <p class="login-info">
        웹과 모바일에서 실시간으로 동기화됩니다
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const loading = ref(false)

const handleGoogleLogin = async () => {
  loading.value = true
  const result = await authStore.signInWithGoogle()
  if (!result.success) {
    alert('로그인에 실패했습니다: ' + result.error)
  }
  loading.value = false
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.login-header {
  margin-bottom: 30px;
}

.login-header h1 {
  font-size: 2rem;
  color: #1F2937;
  margin: 15px 0 10px;
}

.login-header p {
  color: #6B7280;
  font-size: 0.95rem;
}

.google-login-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  cursor: pointer;
  transition: all 0.2s;
}

.google-login-btn:hover {
  background: #F9FAFB;
  border-color: #3B82F6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.google-login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.google-login-btn i {
  font-size: 20px;
  color: #EA4335;
}

.login-info {
  margin-top: 20px;
  color: #9CA3AF;
  font-size: 0.85rem;
}
</style>
