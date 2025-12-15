<template>
  <div class="login-page">
    <!-- 배경 데코레이션 -->
    <div class="bg-decoration"></div>

    <!-- 메인 컨텐츠 -->
    <div class="login-container">
      <div class="login-content fade-in">
        <!-- 로고 영역 -->
        <div class="logo-section">
          <div class="logo-icon">
            <i class="pi pi-check-circle"></i>
          </div>
          <h1 class="app-title">TaskSync</h1>
          <p class="app-subtitle">실시간 동기화 할일 관리</p>
        </div>

        <!-- 로그인 카드 -->
        <div class="login-card glass">
          <div class="card-header">
            <h2>환영합니다! 👋</h2>
            <p>시작하려면 로그인하세요</p>
          </div>

          <button
            class="google-btn"
            @click="handleGoogleLogin"
            :disabled="loading"
          >
            <div class="btn-content">
              <svg class="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span v-if="!loading">Google로 계속하기</span>
              <span v-else>
                <i class="pi pi-spin pi-spinner"></i>
                로그인 중...
              </span>
            </div>
          </button>

          <div class="divider">
            <span>또는</span>
          </div>

          <div class="features">
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>웹과 모바일 실시간 동기화</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-calendar"></i>
              <span>스마트한 캘린더 관리</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-bolt"></i>
              <span>빠르고 직관적인 UI</span>
            </div>
          </div>
        </div>

        <!-- 푸터 -->
        <div class="login-footer">
          <p>로그인하면 <a href="#">이용약관</a> 및 <a href="#">개인정보처리방침</a>에 동의하는 것으로 간주됩니다.</p>
        </div>
      </div>
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
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-container {
  width: 100%;
  max-width: 480px;
  position: relative;
  z-index: 1;
}

.login-content {
  animation: fadeIn 0.8s ease-out;
}

/* 로고 영역 */
.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: float 3s ease-in-out infinite;
}

.logo-icon i {
  font-size: 40px;
  color: white;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.app-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 400;
}

/* 로그인 카드 */
.login-card {
  padding: 40px;
  border-radius: 24px;
  animation: slideIn 0.8s ease-out 0.2s both;
}

.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.card-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
}

.card-header p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

/* Google 버튼 */
.google-btn {
  width: 100%;
  padding: 16px 24px;
  background: white;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.google-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.google-btn:hover::before {
  transform: translateX(100%);
}

.google-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
}

.google-btn:active {
  transform: translateY(0);
}

.google-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #1F2937;
}

.google-icon {
  width: 24px;
  height: 24px;
}

/* 구분선 */
.divider {
  display: flex;
  align-items: center;
  margin: 32px 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
}

.divider span {
  padding: 0 16px;
}

/* 기능 소개 */
.features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.feature-item i {
  font-size: 18px;
  color: #43e97b;
}

/* 푸터 */
.login-footer {
  margin-top: 32px;
  text-align: center;
  animation: fadeIn 1s ease-out 0.4s both;
}

.login-footer p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  line-height: 1.6;
}

.login-footer a {
  color: white;
  text-decoration: none;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s;
}

.login-footer a:hover {
  border-bottom-color: white;
}

/* 반응형 */
@media (max-width: 640px) {
  .app-title {
    font-size: 2rem;
  }

  .login-card {
    padding: 32px 24px;
  }

  .card-header h2 {
    font-size: 1.5rem;
  }

  .google-btn {
    padding: 14px 20px;
    font-size: 15px;
  }

  .feature-item {
    font-size: 13px;
  }
}
</style>
