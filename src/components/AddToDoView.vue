<template>
  <div>
    <div class="header">
      <button @click="toggleDialog" class="add-button">
        <font-awesome-icon :icon="faPlus" />
      </button>
    </div>

    <dialog v-if="showDialog" :open="showDialog" class="dialog">
      <div class="form-container">
        <h2>{{ isEditing ? 'Edit todo' : 'Add a new todo' }}</h2>
        <div class="form">
          <div class="input-group">
            <span class="input-group-text" id="addTodoTitle">Title</span>
            <input
              v-model="newTodo"
              type="text"
              class="form-control"
              placeholder="Add a new ToDo"
              aria-label="Title"
              aria-describedby="addTodoTitle"
            />
          </div>

          <div class="input-group">
            <label class="input-group-text" for="addTodoSelectPriority">Priority</label>
            <select v-model="newTodoPriority" class="form-select" id="addTodoSelectPriority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div class="input-group">
            <textarea
              placeholder="Description for a new todo"
              v-model="newTodoDescription"
              class="form-control"
              id="addToDoDescription"
              rows="3"
            ></textarea>
          </div>
          <div class="form-action-bar">
            <button @click="saveTodo">{{ isEditing ? 'Save' : 'Add Todo' }}</button>
            <button @click="toggleDialog">Close</button>
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTodoStore } from '../stores/todo'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import type { Todo } from '../types/todo'

const props = defineProps({
  todo: {
    type: Object as () => Todo | null,
    default: null,
  },
})

const todoStore = useTodoStore()
const showDialog = ref(false)
const isEditing = ref(false)

const newTodo = ref('')
const newTodoPriority = ref('low')
const newTodoDescription = ref('')

watch(
  () => props.todo,
  (newVal) => {
    if (newVal) {
      newTodo.value = newVal.title
      newTodoPriority.value = newVal.priority
      newTodoDescription.value = newVal.description || ''
      isEditing.value = true
      showDialog.value = true
    } else {
      resetForm()
    }
  },
)

function toggleDialog() {
  showDialog.value = !showDialog.value
  if (!showDialog.value) {
    resetForm()
  }
}

function saveTodo() {
  if (isEditing.value && props.todo) {
    todoStore.updateTodo(props.todo.id, {
      title: newTodo.value,
      priority: newTodoPriority.value,
      description: newTodoDescription.value,
    })
  } else {
    todoStore.addTodo({
      title: newTodo.value,
      priority: newTodoPriority.value,
      description: newTodoDescription.value,
    })
  }
  resetForm()
  showDialog.value = false
}

function resetForm() {
  newTodo.value = ''
  newTodoDescription.value = ''
  newTodoPriority.value = 'low'
  isEditing.value = false
}
</script>

<style scoped>
.header {
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

.dialog {
  border: none;
  padding: 0;
  background: none;
}

.dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.dialog[open] {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  background: #0000007d;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  padding: 1rem;
  z-index: 1000;
  align-content: center;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.form-container {
  border: 1px solid #ccc;
  background-color: #f1f1f1;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  width: 40%;
  margin: 0 auto;
}

.form {
  padding-top: 1rem;
  border-top: 1px solid #ccc;
  margin-top: 0.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-direction: column;
}

.form input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.form select {
  font-size: 1rem;
}

.form textarea {
  resize: none;
  height: 100px;
  margin-top: 0.5rem;
}

.form-action-bar {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.form-action-bar button {
  min-width: 100px;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  background-color: #fff;
  cursor: pointer;
}

.input-group-text {
  width: 100px;
}
</style>
