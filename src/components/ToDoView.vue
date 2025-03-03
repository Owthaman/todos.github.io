<template>
  <div class="todo">
    <div class="tabs">
      <button
        @click="showColumn('critical')"
        class="tabs-button critical"
        :class="{ 'tabs-button--active': visibleColumns.critical }"
      >
        Critical
      </button>
      <button
        @click="showColumn('high')"
        class="tabs-button high"
        :class="{ 'tabs-button--active': visibleColumns.high }"
      >
        High
      </button>
      <button
        @click="showColumn('medium')"
        class="tabs-button medium"
        :class="{ 'tabs-button--active': visibleColumns.medium }"
      >
        Medium
      </button>
      <button
        @click="showColumn('low')"
        class="tabs-button low"
        :class="{ 'tabs-button--active': visibleColumns.low }"
      >
        Low
      </button>
    </div>
    <AddToDoView :todo="selectedTodo" @onAdd="showColumn" />
    <div class="columns">
      <div
        class="column"
        v-for="priority in ['critical', 'high', 'medium', 'low']"
        :key="priority"
        :class="`column--${priority}`"
        v-show="isColumnVisible(priority)"
      >
        <div class="action-bar">
          <button @click="removeAllTodos(priority)">
            Delete all <font-awesome-icon :icon="faTrash" />
          </button>
          <button @click="sortByCreationTime(priority)">
            Sort <font-awesome-icon :icon="faSort" />
          </button>
        </div>
        <ul>
          <li v-for="todo in timeSortedTodos(priority)" :key="todo.id">
            <ToDoCard
              :todo="todo"
              :priority="priority"
              @remove="removeTodo"
              @edit="editTodo"
              @toggle="toggleCompleted"
              @update-priority="changePriority"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTodoStore } from '../stores/todo'
import AddToDoView from '@/components/AddToDoView.vue'
import ToDoCard from '@/components/ToDoCard.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash, faSort } from '@fortawesome/free-solid-svg-icons'
import type { Todo } from '../types/todo'

const todoStore = useTodoStore()
const selectedTodo = ref<Todo | null>(null)
const sortOrder = ref<{ [key: string]: boolean }>({
  critical: false,
  high: false,
  medium: false,
  low: false,
})

const visibleColumns = ref<{ [key: string]: boolean }>({
  critical: true,
  high: false,
  medium: false,
  low: false,
})

onMounted(() => {
  const screenCheck = () => {
    if (window.innerWidth < 769) {
      visibleColumns.value = { critical: true, high: false, medium: false, low: false }
    } else {
      visibleColumns.value = { critical: true, high: true, medium: true, low: true }
    }
  }

  screenCheck()
  window.addEventListener('resize', screenCheck)
})

const removeTodo = (id: number) => {
  todoStore.removeTodo(id)
}

const toggleCompleted = (id: number) => {
  const todo = todoStore.todos.find((todo: Todo) => todo.id === id)
  if (todo) {
    todo.completed = !todo.completed
  }
}

const changePriority = (payload: { id: number; priority: string }) => {
  const todo = todoStore.todos.find((todo: Todo) => todo.id === payload.id)
  if (todo) {
    todo.priority = payload.priority
    showColumn(payload.priority)
  }
}

const editTodo = (todo: Todo) => {
  selectedTodo.value = todo
}

const removeAllTodos = (priority: string) => {
  todoStore.todos = todoStore.todos.filter((todo: Todo) => todo.priority !== priority)
}

const sortByCreationTime = (priority: string) => {
  sortOrder.value[priority] = !sortOrder.value[priority]
}

const timeSortedTodos = (priority: string) => {
  return computed(() => {
    return todoStore.todos
      .filter((todo: Todo) => todo.priority === priority)
      .sort((a: Todo, b: Todo) => {
        const timeA = new Date(a.id).getTime()
        const timeB = new Date(b.id).getTime()
        return sortOrder.value[priority] ? timeA - timeB : timeB - timeA
      })
  }).value
}

const showColumn = (priority: string) => {
  for (const key in visibleColumns.value) {
    visibleColumns.value[key] = false
  }
  visibleColumns.value[priority] = true
}

const isColumnVisible = (priority: string) => {
  return visibleColumns.value[priority]
}
</script>

<style>
.todo {
  padding: 10px;
}

.todo h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

.todo ul {
  list-style-type: none;
  padding: 5px 10px;
}

.todo li {
  margin: 10px 0;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #000;
}

/* Removed card styles */

.todo input,
select {
  margin-right: 10px;
}

.columns {
  display: flex;
  align-items: stretch;
  gap: 10px;
  width: 100%;
  padding-bottom: 100px;
}

.column {
  border-radius: 10px;
  flex: 1;
  min-height: 100vh;
  background-color: #f9f9f9;
}

.column h2 {
  padding: 10px;
  text-align: center;
}

.column--low {
  color: #155724;
  border-right: 2px solid #e4e4e4;
  border-left: 2px solid #e4e4e4;
  border-bottom: 2px solid #e4e4e4;
  border-top: 5px solid #d4edda;
}

.column--medium {
  color: #333;
  border-right: 2px solid #e4e4e4;
  border-left: 2px solid #e4e4e4;
  border-bottom: 2px solid #e4e4e4;
  border-top: 5px solid #ffe6b3;
}

.column--high {
  color: #111;
  border-right: 2px solid #e4e4e4;
  border-left: 2px solid #e4e4e4;
  border-bottom: 2px solid #e4e4e4;
  border-top: 5px solid #ffcc99;
}

.column--critical {
  color: #fff;
  border-right: 2px solid #e4e4e4;
  border-left: 2px solid #e4e4e4;
  border-bottom: 2px solid #e4e4e4;
  border-top: 5px solid #ff6666;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  background-color: #e4e4e4;
  padding: 5px;
}

.action-bar-left {
  display: flex;
}

.action-bar button {
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: #525252;
}

.todo-nav {
  display: flex;
  justify-content: center;
  position: fixed;
  width: 100%;
  background: #fff;
  bottom: 0;
  padding: 10px;
  border-top: 3px solid #ccc;
  left: 0;
  right: 0;
  box-shadow: 0px -3px 4px #5534344f;
  z-index: 1000;
  gap: 1rem;
  align-content: space-between;
}

.add-button {
  font-size: 40px;
  border: none;
  cursor: pointer;
  padding: 0.3rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  background: #3aaa5f;
  color: #fff;
}

.add-button:hover,
.add-button:focus {
  transform: scale(1.05);
}

.add-button:hover {
  transform: scale(1.1);
}

.tabs {
  display: none;
}
@media screen and (max-width: 768px) {
  .columns {
    padding-bottom: 130px;
  }
  .tabs {
    display: flex;
    gap: 0.5rem;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 70px;
    padding: 10px;
    background: #fff;
    box-shadow: 0px -3px 4px #5534344f;
    z-index: 1000;
  }
  .tabs-button {
    font-size: 14px;
    width: 25%;
    padding: 0.5rem;
    border: none;
    border-radius: 5px;
  }
  .tabs-button.critical {
    background: #ff6666;
    color: #fff;
  }
  .tabs-button.high {
    background: #ffcc99;
    color: #111;
  }
  .tabs-button.medium {
    background: #ffe6b3;
    color: #333;
  }
  .tabs-button.low {
    background: #d4edda;
    color: #155724;
  }
  .tabs-button.tabs-button--active {
    position: relative;
  }
  .tabs-button.tabs-button--active::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #ff6666;
  }
  .tabs-button.tabs-button--active.critical::before {
    border-bottom: 10px solid #ff6666;
  }
  .tabs-button.tabs-button--active.high::before {
    border-bottom: 10px solid #ffcc99;
  }
  .tabs-button.tabs-button--active.medium::before {
    border-bottom: 10px solid #ffe6b3;
  }
  .tabs-button.tabs-button--active.low::before {
    border-bottom: 10px solid #d4edda;
  }
}
</style>
