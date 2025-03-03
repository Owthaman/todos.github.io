<template>
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
        @change="changePriority($event)"
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
        <button @click="$emit('remove', todo.id)">
          <font-awesome-icon :icon="faTrash" class="icon" />
        </button>
      </div>
      <div class="action-bar-right">
        <button @click="$emit('edit', todo)" title="Edit">
          <font-awesome-icon :icon="faPen" class="icon" />
        </button>
        <button @click="$emit('toggle', todo.id)">
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
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUndo, faCheck, faTrash, faPen } from '@fortawesome/free-solid-svg-icons'
import type { Todo } from '../types/todo'

const props = defineProps<{
  todo: Todo
  priority: string
}>()

const emit = defineEmits<{
  (e: 'remove', id: number): void
  (e: 'edit', todo: Todo): void
  (e: 'toggle', id: number): void
  (e: 'update-priority', payload: { id: number; priority: string }): void
}>()

const changePriority = (event: Event) => {
  const newPriority = (event.target as HTMLSelectElement).value
  emit('update-priority', { id: props.todo.id, priority: newPriority })
}
</script>

<style scoped>
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
  background-color: #d4edda;
  color: #155724;
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

.card .action-bar {
  border-radius: 0px 0px 5px 5px;
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
</style>
