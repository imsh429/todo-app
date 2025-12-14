<!-- src/views/HomeView.vue -->
<template>
  <div class="home">
    <header class="app-header">
      <h1>TaskSync</h1>
      <div class="user-info">
        <span>사용자님</span>
        <button class="logout-btn">로그아웃</button>
      </div>
    </header>

    <main class="main-content">
      <h2>할 일 목록</h2>
      <p>Todo 기능은 Part 6에서 구현 예정입니다</p>
    </main>
  </div>
</template>

<script setup>
// Part 4-6에서 기능 구현 예정
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #f5f5f5;
}

.app-header {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header h1 {
  color: #667eea;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.logout-btn:hover {
  background: #da190b;
}

.main-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
}
</style>
