<template>
  <div class="home-container">
    <!-- 헤더 -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <i class="pi pi-check-circle"></i>
            <h2>TaskSync</h2>
          </div>

          <nav class="nav">
            <router-link to="/" class="nav-link" active-class="active">
              <i class="pi pi-list"></i>
              <span>할일</span>
            </router-link>
            <router-link to="/calendar" class="nav-link" active-class="active">
              <i class="pi pi-calendar"></i>
              <span>캘린더</span>
            </router-link>
          </nav>

          <div class="user-menu">
            <img
              v-if="authStore.user?.photoURL"
              :src="authStore.user.photoURL"
              :alt="authStore.user.displayName"
              class="user-avatar"
            />
            <span class="user-name">{{ authStore.user?.displayName }}</span>
            <button class="logout-btn" @click="handleLogout">
              <i class="pi pi-sign-out"></i>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 메인 컨텐츠 -->
    <main class="main-content">
      <div class="container">
        <h1 class="page-title">할일 목록</h1>

        <!-- Part 6에서 Todo 컴포넌트 추가 예정 -->
        <div class="empty-state">
          <i class="pi pi-inbox" style="font-size: 4rem; color: #D1D5DB;"></i>
          <h3>아직 할 일이 없습니다</h3>
          <p>새로운 할 일을 추가해보세요!</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const handleLogout = async () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    await authStore.signOut()
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #F9FAFB;
}

/* 헤더 */
.header {
  background: white;
  border-bottom: 1px solid #E5E7EB;
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #3B82F6;
  font-size: 1.2rem;
  font-weight: 700;
}

.logo i {
  font-size: 1.5rem;
}

.nav {
  display: flex;
  gap: 10px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: #6B7280;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-link:hover {
  background: #F3F4F6;
  color: #3B82F6;
}

.nav-link.active {
  background: #EFF6FF;
  color: #3B82F6;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #E5E7EB;
}

.user-name {
  font-size: 0.9rem;
  color: #374151;
  font-weight: 500;
}

.logout-btn {
  padding: 8px 12px;
  background: #FEE2E2;
  border: none;
  border-radius: 8px;
  color: #DC2626;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #FECACA;
}

/* 메인 컨텐츠 */
.main-content {
  padding: 30px 0;
}

.page-title {
  font-size: 1.8rem;
  color: #1F2937;
  margin-bottom: 24px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-state h3 {
  color: #6B7280;
  margin: 16px 0 8px;
}

.empty-state p {
  color: #9CA3AF;
}

/* 반응형 */
@media (max-width: 768px) {
  .user-name {
    display: none;
  }

  .nav-link span {
    display: none;
  }

  .page-title {
    font-size: 1.5rem;
  }
}
</style>
