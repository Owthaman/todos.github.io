import { mount } from '@vue/test-utils'
import AddToDoView from '@/components/AddToDoView.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useTodoStore } from '../../src/stores/todo'
import { nextTick } from 'vue'

describe('AddToDoView.vue', () => {
  let todoStore: ReturnType<typeof useTodoStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    todoStore = useTodoStore()
  })

  it('renders add todo button', () => {
    const wrapper = mount(AddToDoView)
    expect(wrapper.find('.add-todo__button').exists()).toBe(true)
  })

  it('opens dialog when add todo button is clicked', async () => {
    const wrapper = mount(AddToDoView)
    await wrapper.find('.add-todo__button').trigger('click')
    expect(wrapper.find('.add-todo__dialog').exists()).toBe(true)
  })

  it('adds a new todo', async () => {
    const wrapper = mount(AddToDoView)
    await wrapper.find('.add-todo__button').trigger('click')
    await wrapper.find('input').setValue('New Todo')
    await wrapper.find('select').setValue('high')
    await wrapper.find('textarea').setValue('New Todo Description')
    await wrapper.find('.add-todo__form_action_bar button').trigger('click')

    expect(todoStore.addTodo).toHaveBeenCalledWith({
      title: 'New Todo',
      priority: 'high',
      description: 'New Todo Description',
    })
  })

  it('edits an existing todo', async () => {
    const todo = {
      id: 1,
      title: 'Existing Todo',
      priority: 'medium',
      description: 'Existing Description',
    }
    const wrapper = mount(AddToDoView, {
      props: { todo },
    })

    await nextTick()

    expect(wrapper.find('input').element.value).toBe('Existing Todo')
    expect(wrapper.find('select').element.value).toBe('medium')
    expect(wrapper.find('textarea').element.value).toBe('Existing Description')

    await wrapper.find('input').setValue('Updated Todo')
    await wrapper.find('select').setValue('low')
    await wrapper.find('textarea').setValue('Updated Description')
    await wrapper.find('.add-todo__form_action_bar button').trigger('click')

    expect(todoStore.updateTodo).toHaveBeenCalledWith(1, {
      title: 'Updated Todo',
      priority: 'low',
      description: 'Updated Description',
    })
  })
})
