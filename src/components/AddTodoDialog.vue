<template>
  <div v-if="visible" class="dialog-overlay" @click="close">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h2>새 할일 추가</h2>
        <button class="close-btn" @click="close">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>제목 *</label>
          <input
            v-model="formData.title"
            type="text"
            placeholder="할 일을 입력하세요"
            required
            autofocus
          />
        </div>

        <div class="form-group">
          <label>설명</label>
          <textarea
            v-model="formData.description"
            rows="3"
            placeholder="상세 설명 (선택)"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>카테고리</label>
            <select v-model="formData.category">
              <option value="개인">개인</option>
              <option value="업무">업무</option>
              <option value="학습">학습</option>
              <option value="운동">운동</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div class="form-group">
            <label>우선순위</label>
            <select v-model="formData.priority">
              <option value="low">낮음</option>
              <option value="medium">보통</option>
              <option value="high">높음</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>마감일</label>
          <input
            v-model="formData.dueDate"
            type="date"
            :min="today"
          />
        </div>

        <div class="dialog-actions">
          <button type="button" class="btn-cancel" @click="close">
            취소
          </button>
          <button type="submit" class="btn-submit" :disabled="loading">
            <i class="pi pi-check"></i>
            <span v-if="!loading">추가</span>
            <span v-else>추가중...</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useTodoStore } from '@/stores/todos'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const todoStore = useTodoStore()
const loading = ref(false)

const formData = ref({
  title: '',
  description: '',
  category: '개인',
  priority: 'medium',
  dueDate: '',
})

const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// 다이얼로그 열릴 때 폼 초기화
watch(() => props.visible, (newVal) => {
  if (newVal) {
    resetForm()
  }
})

const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    category: '개인',
    priority: 'medium',
    dueDate: '',
  }
}

const handleSubmit = async () => {
  loading.value = true

  const result = await todoStore.addTodo(formData.value)

  loading.value = false

  if (result.success) {
    close()
  } else {
    alert('할일 추가 실패: ' + result.error)
  }
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.dialog-content {
  background: white;
  border-radius: 24px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.dialog-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #e5e7eb;
  transform: rotate(90deg);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.dialog-actions button {
  flex: 1;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-cancel {
  background: #f3f4f6;
  color: #6b7280;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .dialog-content {
    padding: 24px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
