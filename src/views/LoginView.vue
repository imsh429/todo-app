<!-- src/views/LoginView.vue -->
<template>
  <div class="login-container">
    <div class="login-box">
      <h1>TaskSync</h1>
      <p>할 일과 일정을 효율적으로 관리하세요</p>
      <button class="google-login-btn">
        <i class="pi pi-google"></i>
        Google로 로그인
      </button>
    </div>
  </div>
</template>

<script setup>
// Part 4에서 로그인 기능 구현 예정
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
}

.login-box h1 {
  color: #667eea;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

.login-box p {
  color: #666;
  margin-bottom: 2rem;
}

.google-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.google-login-btn:hover {
  background: #357ae8;
}
</style>
