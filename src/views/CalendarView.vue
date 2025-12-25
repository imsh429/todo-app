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
            <button
              class="view-btn"
              :class="{ active: currentView === 'dayGridMonth' }"
              @click="changeView('dayGridMonth')"
            >
              <i class="pi pi-th-large"></i>
              <span>월</span>
            </button>
            <button
              class="view-btn"
              :class="{ active: currentView === 'timeGridWeek' }"
              @click="changeView('timeGridWeek')"
            >
              <i class="pi pi-bars"></i>
              <span>주</span>
            </button>
            <button
              class="view-btn"
              :class="{ active: currentView === 'timeGridDay' }"
              @click="changeView('timeGridDay')"
            >
              <i class="pi pi-list"></i>
              <span>일</span>
            </button>
          </div>
        </div>

        <!-- 캘린더 영역 -->
        <div class="calendar-section slide-in">
          <div class="calendar-card">
            <FullCalendar
              :options="calendarOptions"
              ref="fullCalendarRef"
            />
          </div>

          <!-- 오늘의 일정 -->
          <div class="today-schedule">
            <div class="schedule-header">
              <h3>오늘의 일정</h3>
              <span class="date-badge">{{ currentDate }}</span>
            </div>

            <div v-if="todayTodos.length === 0" class="empty-schedule">
              <i class="pi pi-check-circle"></i>
              <p>오늘 예정된 일정이 없습니다</p>
            </div>

            <div v-else class="schedule-list">
              <div
                v-for="todo in todayTodos"
                :key="todo.id"
                class="schedule-item"
                :class="{ completed: todo.completed }"
              >
                <div class="schedule-dot" :style="{ background: getCategoryColor(todo.category) }"></div>
                <div class="schedule-info">
                  <h4>{{ todo.title }}</h4>
                  <p v-if="todo.description">{{ todo.description }}</p>
                  <div class="schedule-meta">
                    <span class="schedule-category">{{ todo.category }}</span>
                    <span class="schedule-priority" :class="`priority-${todo.priority}`">
                      {{ getPriorityText(todo.priority) }}
                    </span>
                  </div>
                </div>
                <button
                  class="schedule-check"
                  :class="{ checked: todo.completed }"
                  @click="toggleTodo(todo.id)"
                >
                  <i class="pi pi-check"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todos'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const authStore = useAuthStore()
const todoStore = useTodoStore()
const fullCalendarRef = ref(null)
const currentView = ref('dayGridMonth')

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

// FullCalendar 옵션
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: currentView.value,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  locale: 'ko',
  buttonText: {
    today: '오늘',
    month: '월',
    week: '주',
    day: '일'
  },
  events: calendarEvents.value,
  editable: false,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  eventClick: handleEventClick,
  height: 'auto',
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    meridiem: false
  }
}))

// Todo를 캘린더 이벤트로 변환
const calendarEvents = computed(() => {
  return todoStore.allTodos
    .filter(todo => todo.dueDate)
    .map(todo => ({
      id: todo.id,
      title: todo.title,
      start: todo.dueDate,
      allDay: true,
      backgroundColor: getCategoryColor(todo.category),
      borderColor: getCategoryColor(todo.category),
      textColor: '#ffffff',
      extendedProps: {
        description: todo.description,
        category: todo.category,
        priority: todo.priority,
        completed: todo.completed
      },
      classNames: todo.completed ? ['event-completed'] : []
    }))
})

// 오늘 날짜
const currentDate = computed(() => {
  const today = new Date()
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(today)
})

// 오늘의 Todo 목록
const todayTodos = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return todoStore.allTodos.filter(todo => {
    if (!todo.dueDate) return false
    const dueDate = new Date(todo.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate.getTime() === today.getTime()
  })
})

// 이벤트 클릭 핸들러
const handleEventClick = (info) => {
  const todo = todoStore.allTodos.find(t => t.id === info.event.id)
  if (todo) {
    const message = `
제목: ${todo.title}
${todo.description ? '설명: ' + todo.description : ''}
카테고리: ${todo.category}
우선순위: ${getPriorityText(todo.priority)}
상태: ${todo.completed ? '완료' : '진행중'}
    `.trim()

    alert(message)
  }
}

// 카테고리 색상
const getCategoryColor = (category) => {
  const colors = {
    '개인': '#667eea',
    '업무': '#f093fb',
    '학습': '#4facfe',
    '운동': '#43e97b',
    '기타': '#ffa45b',
  }
  return colors[category] || '#667eea'
}

// 우선순위 텍스트
const getPriorityText = (priority) => {
  const map = {
    low: '낮음',
    medium: '보통',
    high: '높음',
  }
  return map[priority] || '보통'
}

// Todo 완료 토글
const toggleTodo = async (todoId) => {
  await todoStore.toggleComplete(todoId)
}

// 뷰 변경
const changeView = (view) => {
  currentView.value = view
  if (fullCalendarRef.value) {
    const calendarApi = fullCalendarRef.value.getApi()
    calendarApi.changeView(view)
  }
}

// 로그아웃
const handleLogout = async () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    todoStore.stopListener()
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
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  min-height: 600px;
}

/* FullCalendar 스타일 */
:deep(.fc) {
  font-family: 'Inter', sans-serif;
}

:deep(.fc .fc-button) {
  background: #667eea;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 600;
  text-transform: none;
}

:deep(.fc .fc-button:hover) {
  background: #5568d3;
}

:deep(.fc .fc-button-primary:not(:disabled).fc-button-active) {
  background: #764ba2;
}

:deep(.fc-toolbar-title) {
  font-size: 1.5rem !important;
  font-weight: 700;
  color: #1a1a2e;
}

:deep(.fc-col-header-cell) {
  background: #f9fafb;
  padding: 12px 0;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  font-size: 12px;
}

:deep(.fc-daygrid-day-number) {
  padding: 8px;
  font-weight: 600;
  color: #374151;
}

:deep(.fc-day-today) {
  background: rgba(102, 126, 234, 0.05) !important;
}

:deep(.fc-day-today .fc-daygrid-day-number) {
  background: #667eea;
  color: white;
  border-radius: 8px;
  padding: 4px 8px;
}

:deep(.fc-event) {
  border-radius: 6px;
  padding: 2px 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none !important;
}

:deep(.fc-event:hover) {
  opacity: 0.8;
}

:deep(.event-completed) {
  opacity: 0.5;
  text-decoration: line-through;
}

:deep(.fc-daygrid-event-dot) {
  display: none;
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

/* 오늘의 일정 리스트 */
.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.3s;
}

.schedule-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.schedule-item.completed {
  opacity: 0.6;
}

.schedule-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.schedule-info {
  flex: 1;
  min-width: 0;
}

.schedule-info h4 {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 4px;
  word-break: break-word;
}

.schedule-item.completed h4 {
  text-decoration: line-through;
  color: #9ca3af;
}

.schedule-info p {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
  word-break: break-word;
}

.schedule-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.schedule-meta span {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}

.schedule-category {
  background: #e5e7eb;
  color: #374151;
}

.schedule-priority {
  background: #dbeafe;
  color: #2563eb;
}

.schedule-priority.priority-high {
  background: #fee2e2;
  color: #dc2626;
}

.schedule-priority.priority-medium {
  background: #fef3c7;
  color: #d97706;
}

.schedule-check {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 2px solid #d1d5db;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  flex-shrink: 0;
}

.schedule-check:hover {
  border-color: #667eea;
}

.schedule-check.checked {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.schedule-check i {
  color: white;
  font-size: 14px;
  opacity: 0;
  transition: all 0.3s;
}

.schedule-check.checked i {
  opacity: 1;
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

  .today-schedule {
    padding: 20px;
  }
}
</style>
