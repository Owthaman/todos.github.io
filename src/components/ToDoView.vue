<template>
  <div class="todo">
    <div class="tabs">
      <button @click="showColumn('critical')" class="tabs-button critical">Critical</button>
      <button @click="showColumn('high')" class="tabs-button high">High</button>
      <button @click="showColumn('medium')" class="tabs-button medium">Medium</button>
      <button @click="showColumn('low')" class="tabs-button low">Low</button>
    </div>
    <AddToDoView :todo="selectedTodo" />
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
            <div class="card">
              <h3>
                <div class="header">
                  <s v-if="todo.completed">{{ todo.title }}</s>
                  <span v-else>{{ todo.title }}</span>
                  <small
                    >{{ new Date(todo.id).toLocaleDateString() }}
                    {{
                      new Date(todo.id).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })
                    }}</small
                  >
                </div>

                <select
                  class="form-select form-select-sm mr-0"
                  :value="todo.priority"
                  @change="changePriority(todo.id, ($event.target as HTMLSelectElement).value)"
                  title="Change priority"
                  :class="`form-select--${priority}`"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </h3>
              <p>
                <s v-if="todo.completed">{{ todo.description }}</s
                ><span v-else>{{ todo.description }}</span>
              </p>
              <div class="action-bar">
                <div class="action-bar-left">
                  <button @click="removeTodo(todo.id)">
                    <font-awesome-icon :icon="faTrash" class="icon" />
                  </button>
                </div>
                <div class="action-bar-right">
                  <button @click="editTodo(todo)" title="Edit">
                    <font-awesome-icon :icon="faPen" class="icon" />
                  </button>
                  <button @click="toggleCompleted(todo.id)">
                    <font-awesome-icon
                      v-if="todo.completed"
                      :icon="faUndo"
                      class="icon"
                      title="Mark as undone"
                    />
                    <font-awesome-icon v-else :icon="faCheck" class="icon" title="Mark as done" />
                  </button>
                </div>
              </div>
            </div>
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUndo, faCheck, faTrash, faPen, faSort } from '@fortawesome/free-solid-svg-icons'
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

const changePriority = (id: number, newPriority: string) => {
  const todo = todoStore.todos.find((todo: Todo) => todo.id === id)
  if (todo) {
    todo.priority = newPriority
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

.card {
  border-radius: 5px;
  box-shadow: 0 3px 4px #5534344f;
  overflow: hidden;
}

.card h3 {
  margin: 0px 0 10px;
  font-size: 20px;
  font-weight: bold;
  text-transform: capitalize;
  padding: 5px 10px;
  background-color: #dbdbdb;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: baseline;
}

.card h3 small {
  padding-top: 5px;
  display: block;
  font-size: 12px;
  color: #555;
  font-weight: 100;
  text-transform: lowercase;
}

.card h3 select.form-select {
  width: 100px;
  margin-right: 0;
  margin-top: 5px;
}

.card h3 select.form-select.form-select--low {
  background-color: #fff9cc;
  color: #555;
}

.card h3 select.form-select.form-select--medium {
  background-color: #ffe6b3;
  color: #333;
}

.card h3 select.form-select.form-select--high {
  background-color: #ffcc99;
  color: #111;
}

.card h3 select.form-select.form-select--critical {
  background-color: #ff9999;
  color: #333;
}

.card p {
  font-size: 16px;
  padding: 5px 10px;
}

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
  color: #555;
  border-right: 2px solid #e4e4e4;
  border-left: 2px solid #e4e4e4;
  border-bottom: 2px solid #e4e4e4;
  border-top: 5px solid #fff9cc;
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

.card .action-bar {
  border-radius: 0px 0px 5px 5px;
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
    border: 1px solid #ccc;
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
    background: #fff9cc;
    color: #555;
  }
}
</style>
