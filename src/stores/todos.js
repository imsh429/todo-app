// src/stores/todos.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from './auth'

export const useTodoStore = defineStore('todos', () => {
  const todos = ref([])
  const loading = ref(false)
  const error = ref(null)
  const unsubscribe = ref(null)

  // Getters
  const allTodos = computed(() => todos.value)

  // Firestore 실시간 리스너 (Part 5에서 구현 예정)
  const subscribeTodos = (userId) => {
    const q = query(
      collection(db, 'todos'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    return onSnapshot(q, (snapshot) => {
      todos.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    })
  }

  // Todo 추가 (Part 5에서 구현 예정)
  const addTodo = async (todoData) => {
    // 구현 예정
  }

  // Todo 수정 (Part 5에서 구현 예정)
  const updateTodo = async (todoId, updates) => {
    // 구현 예정
  }

  // Todo 삭제 (Part 5에서 구현 예정)
  const deleteTodo = async (todoId) => {
    // 구현 예정
  }

  // Todo 완료 토글 (Part 5에서 구현 예정)
  const toggleComplete = async (todoId, completed) => {
    // 구현 예정
  }

  return {
    todos,
    loading,
    subscribeTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete
  }
})
