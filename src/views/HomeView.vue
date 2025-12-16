<template>
  <div class="home-page">
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
            <router-link to="/" class="nav-item" active-class="active">
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
            <h1 class="page-title">오늘의 할일 ✨</h1>
            <p class="page-subtitle">생산적인 하루를 만들어가세요</p>
          </div>
          <button class="add-btn" @click="openAddDialog" title="할일 추가">
            <i class="pi pi-plus"></i>
            <span>새 할일</span>
          </button>
        </div>

        <!-- 통계 카드 -->
        <div class="stats-grid slide-in">
          <div class="stat-card glass">
            <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <i class="pi pi-list"></i>
            </div>
            <div class="stat-info">
              <p class="stat-label">전체</p>
              <p class="stat-value">{{ todoStore.stats.total }}</p>
            </div>
          </div>

          <div class="stat-card glass">
            <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
              <i class="pi pi-clock"></i>
            </div>
            <div class="stat-info">
              <p class="stat-label">진행중</p>
              <p class="stat-value">{{ todoStore.stats.active }}</p>
            </div>
          </div>

          <div class="stat-card glass">
            <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
              <i class="pi pi-check"></i>
            </div>
            <div class="stat-info">
              <p class="stat-label">완료</p>
              <p class="stat-value">{{ todoStore.stats.completed }}</p>
            </div>
          </div>
        </div>

        <!-- 할일 리스트 영역 -->
        <div class="todo-section fade-in" style="animation-delay: 0.2s;">
          <div class="section-header">
            <h2 class="section-title">할일 목록</h2>
            <div class="filter-tabs">
              <button
                class="tab-btn"
                :class="{ active: currentFilter === 'all' }"
                @click="setFilter('all')"
              >
                전체
              </button>
              <button
                class="tab-btn"
                :class="{ active: currentFilter === 'active' }"
                @click="setFilter('active')"
              >
                진행중
              </button>
              <button
                class="tab-btn"
                :class="{ active: currentFilter === 'completed' }"
                @click="setFilter('completed')"
              >
                완료
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="showEmptyState" class="empty-state">
            <div class="empty-icon">
              <i class="pi pi-inbox"></i>
            </div>
            <h3>
              {{ currentFilter === 'all' ? '아직 할일이 없습니다' :
              currentFilter === 'active' ? '진행중인 할일이 없습니다' :
                '완료된 할일이 없습니다' }}
            </h3>
            <p>새로운 할일을 추가하여 시작해보세요!</p>
            <button class="empty-btn" @click="openAddDialog">
              <i class="pi pi-plus"></i>
              첫 번째 할일 만들기
            </button>
          </div>

          <!-- Todo 목록 -->
          <div v-else class="todo-list">
            <TodoItem
              v-for="todo in filteredTodos"
              :key="todo.id"
              :todo="todo"
              @edit="openEditDialog"
              @delete="handleDeleteTodo"
            />

            <!-- 완료된 항목 삭제 버튼 -->
            <div v-if="currentFilter === 'completed' && todoStore.completedTodos.length > 0" class="list-footer">
              <button class="clear-btn" @click="clearCompleted">
                <i class="pi pi-trash"></i>
                완료된 항목 모두 삭제 ({{ todoStore.completedTodos.length }})
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add Todo Dialog -->
    <AddTodoDialog
      :visible="showAddDialog"
      @close="closeAddDialog"
    />

    <!-- Edit Todo Dialog -->
    <EditTodoDialog
      :visible="showEditDialog"
      :todo="editingTodo"
      @close="closeEditDialog"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todos'
import AddTodoDialog from '@/components/AddTodoDialog.vue'
import EditTodoDialog from '@/components/EditTodoDialog.vue'
import TodoItem from '@/components/TodoItem.vue'

const authStore = useAuthStore()
const todoStore = useTodoStore()

const showAddDialog = ref(false)
const showEditDialog = ref(false)
const editingTodo = ref(null)
const currentFilter = ref('all') // 'all', 'active', 'completed'

// 필터링된 Todo 목록
const filteredTodos = computed(() => {
  switch (currentFilter.value) {
    case 'active':
      return todoStore.activeTodos
    case 'completed':
      return todoStore.completedTodos
    default:
      return todoStore.allTodos
  }
})

// Empty State 표시 여부
const showEmptyState = computed(() => {
  return filteredTodos.value.length === 0
})

// 컴포넌트 마운트 시 Todo 리스너 시작
onMounted(() => {
  if (authStore.user) {
    todoStore.startListener()
  }
})

// 컴포넌트 언마운트 시 리스너 정지
onUnmounted(() => {
  todoStore.stopListener()
})

const handleLogout = async () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    todoStore.stopListener()
    await authStore.signOut()
  }
}

const openAddDialog = () => {
  showAddDialog.value = true
}

const closeAddDialog = () => {
  showAddDialog.value = false
}

const openEditDialog = (todo) => {
  editingTodo.value = todo
  showEditDialog.value = true
}

const closeEditDialog = () => {
  showEditDialog.value = false
  editingTodo.value = null
}

const handleDeleteTodo = async (todoId) => {
  const result = await todoStore.deleteTodo(todoId)
  if (!result.success) {
    alert('삭제 실패: ' + result.error)
  }
}

const setFilter = (filter) => {
  currentFilter.value = filter
}

const clearCompleted = async () => {
  if (todoStore.completedTodos.length === 0) return

  if (confirm(`완료된 할일 ${todoStore.completedTodos.length}개를 삭제하시겠습니까?`)) {
    const result = await todoStore.clearCompleted()
    if (!result.success) {
      alert('삭제 실패: ' + result.error)
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  position: relative;
}

/* 네비게이션 헤더 */
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

/* 로고 */
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

/* 네비게이션 메뉴 */
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

/* 사용자 섹션 */
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

/* 컨텐츠 헤더 */
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

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  background: white;
  border: none;
  border-radius: 14px;
  font-weight: 600;
  font-size: 15px;
  color: #667eea;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

/* 통계 그리드 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  padding: 24px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.stat-info {
  flex: 1;
}

.stat-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin-bottom: 4px;
}

.stat-value {
  color: white;
  font-size: 2rem;
  font-weight: 700;
}

/* 할일 섹션 */
.todo-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 12px;
}

.tab-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon i {
  font-size: 56px;
  color: #9ca3af;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 24px;
}

.empty-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 14px;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.empty-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
}

/* Todo 목록 */
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
}

.todo-list::-webkit-scrollbar {
  width: 8px;
}

.todo-list::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 4px;
}

.todo-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.todo-list::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* 목록 하단 */
.list-footer {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  margin-top: 8px;
  border-top: 1px solid #e5e7eb;
}

.clear-btn {
  padding: 12px 24px;
  background: #fef2f2;
  color: #dc2626;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.clear-btn:hover {
  background: #fee2e2;
  transform: translateY(-2px);
}

/* 반응형 */
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

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .todo-section {
    padding: 24px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
