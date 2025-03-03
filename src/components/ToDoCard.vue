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
/* ...existing styles from ToDoView.vue for the card... */
</style>
