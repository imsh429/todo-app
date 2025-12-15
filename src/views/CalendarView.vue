<template>
  <div class="calendar-page">
    <!-- 배경 -->
    <div class="bg-decoration"></div>

    <!-- 네비게이션 헤더 -->
    <header class="nav-header glass">
      <div class="container">
        <div class="nav-content">
          <!-- 로고 -->
          <div class="logo">
            <div class="logo-icon">
              <i class="pi pi-check-circle"></i>
            </div>
            <span class="logo-text">TaskSync</span>
          </div>

          <!-- 네비게이션 메뉴 -->
          <nav class="nav-menu">
            <router-link to="/" class="nav-item">
              <i class="pi pi-list"></i>
              <span>할일</span>
            </router-link>
            <router-link to="/calendar" class="nav-item" active-class="active">
              <i class="pi pi-calendar"></i>
              <span>캘린더</span>
            </router-link>
          </nav>

          <!-- 사용자 메뉴 -->
          <div class="user-section">
            <div class="user-info">
              <img
                v-if="authStore.user?.photoURL"
                :src="authStore.user.photoURL"
                :alt="authStore.user.displayName"
                class="user-avatar"
              />
              <span class="user-name">{{ authStore.user?.displayName }}</span>
            </div>
            <button class="logout-btn" @click="handleLogout" title="로그아웃">
              <i class="pi pi-sign-out"></i>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 메인 컨텐츠 -->
    <main class="main-content">
      <div class="container">
        <!-- 헤더 -->
        <div class="content-header fade-in">
          <div>
            <h1 class="page-title">캘린더 📅</h1>
            <p class="page-subtitle">일정을 한눈에 확인하세요</p>
          </div>
          <div class="header-actions">
            <button class="view-btn active">
              <i class="pi pi-th-large"></i>
              <span>월</span>
            </button>
            <button class="view-btn">
              <i class="pi pi-bars"></i>
              <span>주</span>
            </button>
            <button class="view-btn">
              <i class="pi pi-list"></i>
              <span>일</span>
            </button>
          </div>
        </div>

        <!-- 캘린더 영역 -->
        <div class="calendar-section slide-in">
          <div class="calendar-card">
            <div class="calendar-placeholder">
              <div class="placeholder-icon">
                <i class="pi pi-calendar"></i>
              </div>
              <h3>캘린더 기능</h3>
              <p>Part 7에서 FullCalendar가 통합됩니다</p>
              <div class="feature-preview">
                <div class="preview-item">
                  <i class="pi pi-calendar-plus"></i>
                  <span>일정 추가</span>
                </div>
                <div class="preview-item">
                  <i class="pi pi-bell"></i>
                  <span>알림 설정</span>
                </div>
                <div class="preview-item">
                  <i class="pi pi-sync"></i>
                  <span>실시간 동기화</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 오늘의 일정 -->
          <div class="today-schedule">
            <div class="schedule-header">
              <h3>오늘의 일정</h3>
              <span class="date-badge">{{ currentDate }}</span>
            </div>
            <div class="empty-schedule">
              <i class="pi pi-check-circle"></i>
              <p>오늘 예정된 일정이 없습니다</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const currentDate = computed(() => {
  const today = new Date()
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(today)
})

const handleLogout = async () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    await authStore.signOut()
  }
}
</script>

<style scoped>
.calendar-page {
  min-height: 100vh;
  position: relative;
}

/* 네비게이션 헤더 - HomeView와 동일 */
.nav-header {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 16px 0;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.logo-icon i {
  font-size: 20px;
  color: white;
}

.logo-text {
  font-size: 1.3rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
}

.nav-menu {
  display: flex;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s;
  background: transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  transform: translateY(-2px);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.25);
  color: white;
}

.nav-item i {
  font-size: 18px;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid white;
}

.user-name {
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.logout-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: rgba(255, 107, 107, 0.2);
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-btn:hover {
  background: rgba(255, 107, 107, 0.3);
  transform: translateY(-2px);
}

/* 메인 컨텐츠 */
.main-content {
  padding: 40px 0;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
  letter-spacing: -1px;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}

.header-actions {
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px;
  border-radius: 14px;
  backdrop-filter: blur(10px);
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  background: transparent;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.view-btn.active {
  background: white;
  color: #667eea;
}

.view-btn:hover:not(.active) {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* 캘린더 섹션 */
.calendar-section {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;
}

.calendar-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  min-height: 600px;
}

/* Placeholder */
.calendar-placeholder {
  text-align: center;
  padding: 80px 20px;
}

.placeholder-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 3s ease-in-out infinite;
}

.placeholder-icon i {
  font-size: 56px;
  color: white;
}

.calendar-placeholder h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.calendar-placeholder p {
  color: #6b7280;
  margin-bottom: 32px;
}

.feature-preview {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 40px;
}

.preview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.preview-item i {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.preview-item span {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
}

/* 오늘의 일정 */
.today-schedule {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.schedule-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.schedule-header h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a2e;
}

.date-badge {
  padding: 6px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
}

.empty-schedule {
  text-align: center;
  padding: 60px 20px;
}

.empty-schedule i {
  font-size: 48px;
  color: #43e97b;
  margin-bottom: 16px;
}

.empty-schedule p {
  color: #6b7280;
  font-size: 14px;
}

/* 반응형 */
@media (max-width: 1024px) {
  .calendar-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .nav-content {
    flex-wrap: wrap;
  }

  .user-name {
    display: none;
  }

  .nav-item span {
    display: none;
  }

  .page-title {
    font-size: 2rem;
  }

  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .view-btn span {
    display: none;
  }

  .calendar-card {
    padding: 24px;
  }

  .feature-preview {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
