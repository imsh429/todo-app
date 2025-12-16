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

  const activeTodos = computed(() =>
    todos.value.filter(todo => !todo.completed)
  )

  const completedTodos = computed(() =>
    todos.value.filter(todo => todo.completed)
  )

  const stats = computed(() => ({
    total: todos.value.length,
    active: activeTodos.value.length,
    completed: completedTodos.value.length,
  }))

  const todosByCategory = computed(() => {
    const categories = {}
    todos.value.forEach(todo => {
      if (!categories[todo.category]) {
        categories[todo.category] = []
      }
      categories[todo.category].push(todo)
    })
    return categories
  })

  // Firestore 실시간 리스너 시작
  const startListener = () => {
    const authStore = useAuthStore()

    if (!authStore.user) {
      console.log('User not logged in')
      return
    }

    // 이미 리스너가 있으면 정리
    if (unsubscribe.value) {
      unsubscribe.value()
    }

    const userId = authStore.user.uid
    const todosRef = collection(db, 'todos')
    const q = query(
      todosRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    loading.value = true

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
