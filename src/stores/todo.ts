import { ref, watch, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { Todo } from '../types/todo'

interface TodoStore {
  todos: Ref<Todo[]>
  addTodo: (newTodo: { title: string; description?: string; priority: string }) => void
  removeTodo: (id: number) => void
  setPriority: (id: number, priority: string) => void
  setCompleted: (id: number, completed: boolean) => void
  updateTodo: (
    id: number,
    updatedTodo: { title: string; description?: string; priority: string },
  ) => void
}

export const useTodoStore = defineStore<'todo', TodoStore>('todo', () => {
  const todos = ref<Todo[]>([])
  const savedTodos = localStorage.getItem('todos')
  if (savedTodos) {
    todos.value = JSON.parse(savedTodos)
  }

  watch(
    todos,
    (newTodos) => {
      localStorage.setItem('todos', JSON.stringify(newTodos))
    },
    { deep: true },
  )

  function addTodo(newTodo: { title: string; description?: string; priority: string }) {
    todos.value.push({
      id: Date.now(),
      title: newTodo.title,
      description: newTodo.description,
      priority: newTodo.priority,
      completed: false,
    })
  }

  function removeTodo(id: number) {
    todos.value = todos.value.filter((todo) => todo.id !== id)
  }

  function setPriority(id: number, priority: string) {
    const todo = todos.value.find((todo) => todo.id === id)
    if (todo) {
      const now = Date.now()
      todo.priority = priority
      todo.id = now
    }
  }

  function setCompleted(id: number, completed: boolean) {
    const todo = todos.value.find((todo) => todo.id === id)
    if (todo) {
      todo.completed = completed
    }
  }

  function updateTodo(
    id: number,
    updatedTodo: { title: string; description?: string; priority: string },
  ) {
    const now = Date.now()
    const todo = todos.value.find((todo) => todo.id === id)
    if (todo) {
      todo.title = updatedTodo.title
      todo.description = updatedTodo.description
      todo.priority = updatedTodo.priority
      todo.id = now
    }
  }

  return { todos, addTodo, removeTodo, setPriority, setCompleted, updateTodo }
})
