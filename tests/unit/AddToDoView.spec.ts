import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AddToDoView from '../../src/components/AddToDoView.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useTodoStore } from '../../src/stores/todo'

describe('AddToDoView.vue', () => {
  let todoStore: ReturnType<typeof useTodoStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    todoStore = useTodoStore()
    vi.spyOn(todoStore, 'addTodo')
    vi.spyOn(todoStore, 'updateTodo')
  })

  it('renders add todo button', () => {
    const wrapper = mount(AddToDoView)
    expect(wrapper.find('.add-button').exists()).toBe(true)
  })

  it('opens dialog when add todo button is clicked', async () => {
    const wrapper = mount(AddToDoView)
    await wrapper.find('.add-button').trigger('click')
    expect(wrapper.find('.dialog').exists()).toBe(true)
  })

  it('adds a new todo', async () => {
    const wrapper = mount(AddToDoView)
    await wrapper.find('.add-button').trigger('click')
    await wrapper.find('input').setValue('New Todo')
    await wrapper.find('select').setValue('high')
    await wrapper.find('textarea').setValue('New Todo Description')
    await wrapper.find('.form-action-bar button').trigger('click')

    expect(todoStore.addTodo).toHaveBeenCalledWith({
      title: 'New Todo',
      priority: 'high',
      description: 'New Todo Description',
    })
  })
})
