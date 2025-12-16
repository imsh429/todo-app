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

    // 실시간 리스너 등록
    unsubscribe.value = onSnapshot(
      q,
      (snapshot) => {
        todos.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
          dueDate: doc.data().dueDate?.toDate(),
        }))
        loading.value = false
        error.value = null
      },
      (err) => {
        console.error('Error listening to todos:', err)
        error.value = err.message
        loading.value = false
      }
    )
  }

  // 리스너 정지
  const stopListener = () => {
    if (unsubscribe.value) {
      unsubscribe.value()
      unsubscribe.value = null
    }
    todos.value = []
  }

  // Todo 추가
  const addTodo = async (todoData) => {
    const authStore = useAuthStore()

    if (!authStore.user) {
      throw new Error('User not authenticated')
    }

    try {
      const newTodo = {
        userId: authStore.user.uid,
        title: todoData.title,
        description: todoData.description || '',
        category: todoData.category || '개인',
        priority: todoData.priority || 'medium',
        dueDate: todoData.dueDate ? Timestamp.fromDate(new Date(todoData.dueDate)) : null,
        completed: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }

      await addDoc(collection(db, 'todos'), newTodo)
      return { success: true }
    } catch (err) {
      console.error('Error adding todo:', err)
      return { success: false, error: err.message }
    }
  }

  // Todo 수정
  const updateTodo = async (todoId, updates) => {
    try {
      const todoRef = doc(db, 'todos', todoId)
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now(),
      }

      // dueDate가 있으면 Timestamp로 변환
      if (updates.dueDate) {
        updateData.dueDate = Timestamp.fromDate(new Date(updates.dueDate))
      }

      await updateDoc(todoRef, updateData)
      return { success: true }
    } catch (err) {
      console.error('Error updating todo:', err)
      return { success: false, error: err.message }
    }
  }

  // Todo 삭제
  const deleteTodo = async (todoId) => {
    try {
      await deleteDoc(doc(db, 'todos', todoId))
      return { success: true }
    } catch (err) {
      console.error('Error deleting todo:', err)
      return { success: false, error: err.message }
    }
  }

  // Todo 완료 토글
  const toggleComplete = async (todoId) => {
    const todo = todos.value.find(t => t.id === todoId)
    if (!todo) return

    return await updateTodo(todoId, {
      completed: !todo.completed
    })
  }

  // 여러 Todo 삭제
  const deleteMultipleTodos = async (todoIds) => {
    try {
      const promises = todoIds.map(id => deleteTodo(id))
      await Promise.all(promises)
      return { success: true }
    } catch (err) {
      console.error('Error deleting multiple todos:', err)
      return { success: false, error: err.message }
    }
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
