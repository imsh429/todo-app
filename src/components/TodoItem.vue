<template>
  <div class="todo-item" :class="{ completed: todo.completed }">
    <div class="todo-content">
      <!-- 체크박스 -->
      <label class="checkbox-wrapper">
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="handleToggle"
        />
        <span class="checkmark">
          <i class="pi pi-check"></i>
        </span>
      </label>

      <!-- Todo 정보 -->
      <div class="todo-info">
        <h3 class="todo-title">{{ todo.title }}</h3>
        <p v-if="todo.description" class="todo-description">
          {{ todo.description }}
        </p>
        <div class="todo-meta">
          <span class="todo-category" :style="getCategoryStyle(todo.category)">
            <i class="pi pi-tag"></i>
            {{ todo.category }}
          </span>
          <span class="todo-priority" :class="`priority-${todo.priority}`">
            <i class="pi pi-circle-fill"></i>
            {{ getPriorityText(todo.priority) }}
          </span>
          <span v-if="todo.dueDate" class="todo-due" :class="{ overdue: isOverdue }">
            <i class="pi pi-calendar"></i>
            {{ formatDate(todo.dueDate) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 액션 버튼 -->
    <div class="todo-actions">
      <button class="action-btn edit-btn" @click="handleEdit" title="수정">
        <i class="pi pi-pencil"></i>
      </button>
      <button class="action-btn delete-btn" @click="handleDelete" title="삭제">
        <i class="pi pi-trash"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTodoStore } from '@/stores/todos'

const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['edit'])

const todoStore = useTodoStore()

// 완료 토글
const handleToggle = async () => {
  await todoStore.toggleComplete(props.todo.id)
}

// 수정
const handleEdit = () => {
  emit('edit', props.todo)
}

// 삭제
const handleDelete = async () => {
  if (confirm('이 할일을 삭제하시겠습니까?')) {
    await todoStore.deleteTodo(props.todo.id)
  }
}

// 날짜 포맷
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const today = new Date()
  const diffTime = d.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '오늘'
  if (diffDays === 1) return '내일'
  if (diffDays === -1) return '어제'
  if (diffDays < -1) return `${Math.abs(diffDays)}일 전`
  if (diffDays > 1) return `${diffDays}일 후`

  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

// 마감일 지남 체크
const isOverdue = computed(() => {
  if (!props.todo.dueDate || props.todo.completed) return false
  return new Date(props.todo.dueDate) < new Date()
})

// 우선순위 텍스트
const getPriorityText = (priority) => {
  const map = {
    low: '낮음',
    medium: '보통',
    high: '높음',
  }
  return map[priority] || '보통'
}

// 카테고리 스타일
const getCategoryStyle = (category) => {
  const colors = {
    '개인': '#667eea',
    '업무': '#f093fb',
    '학습': '#4facfe',
    '운동': '#43e97b',
    '기타': '#ffa45b',
  }
  return {
    backgroundColor: colors[category] || '#667eea',
  }
}
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  border: 2px solid transparent;
  transition: all 0.3s;
  animation: slideIn 0.3s ease-out;
}

.todo-item:hover {
  border-color: #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-item.completed .todo-title {
  text-decoration: line-through;
  color: #9ca3af;
}

.todo-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

/* 체크박스 */
.checkbox-wrapper {
  position: relative;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}

.checkbox-wrapper input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  background: white;
  transition: all 0.3s;
}

.checkbox-wrapper:hover .checkmark {
  border-color: #667eea;
}

.checkbox-wrapper input:checked ~ .checkmark {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.checkmark i {
  color: white;
  font-size: 14px;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s;
}

.checkbox-wrapper input:checked ~ .checkmark i {
  opacity: 1;
  transform: scale(1);
}

/* Todo 정보 */
.todo-info {
  flex: 1;
  min-width: 0;
}

.todo-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 4px 0;
  word-break: break-word;
}

.todo-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
  line-height: 1.5;
  word-break: break-word;
}

.todo-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.todo-meta > span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
}

.todo-category {
  color: white;
}

.todo-priority {
  background: #f3f4f6;
  color: #6b7280;
}

.priority-high {
  background: #fee2e2;
  color: #dc2626;
}

.priority-high i {
  color: #dc2626;
}

.priority-medium {
  background: #fef3c7;
  color: #d97706;
}

.priority-medium i {
  color: #d97706;
}

.priority-low {
  background: #dbeafe;
  color: #2563eb;
}

.priority-low i {
  color: #2563eb;
}

.todo-due {
  background: #f3f4f6;
  color: #6b7280;
}

.todo-due.overdue {
  background: #fee2e2;
  color: #dc2626;
}

.todo-due.overdue i {
  color: #dc2626;
}

/* 액션 버튼 */
.todo-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s;
}

.todo-item:hover .todo-actions {
  opacity: 1;
  transform: translateX(0);
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  font-size: 14px;
}

.edit-btn {
  background: #eff6ff;
  color: #2563eb;
}

.edit-btn:hover {
  background: #dbeafe;
  transform: scale(1.1);
}

.delete-btn {
  background: #fef2f2;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fee2e2;
  transform: scale(1.1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .todo-item {
    padding: 16px;
  }

  .todo-actions {
    opacity: 1;
    transform: translateX(0);
  }

  .action-btn {
    width: 32px;
    height: 32px;
  }
}
</style>
