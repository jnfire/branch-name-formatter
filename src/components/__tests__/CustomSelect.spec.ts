import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CustomSelect from '../CustomSelect.vue'
import { nextTick } from 'vue'

describe('CustomSelect', () => {
  const options = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'opt3', label: 'Option 3' }
  ]

  it('renders correctly with initial value', () => {
    const wrapper = mount(CustomSelect, {
      props: {
        modelValue: 'opt2',
        options
      }
    })
    expect(wrapper.find('.select-label').text()).toBe('Option 2')
    expect(wrapper.find('input[type="hidden"]').attributes('value')).toBe('opt2')
  })

  it('shows placeholder when no value is provided', () => {
    const wrapper = mount(CustomSelect, {
      props: {
        modelValue: '',
        options,
        placeholder: 'Select one'
      }
    })
    expect(wrapper.find('.select-label').text()).toBe('Select one')
    expect(wrapper.find('.select-label').classes()).toContain('placeholder')
  })

  it('toggles dropdown on click', async () => {
    const wrapper = mount(CustomSelect, {
      props: { modelValue: '', options }
    })
    const trigger = wrapper.find('.custom-select-trigger')
    
    // initially closed
    expect(wrapper.find('.custom-select-dropdown').exists()).toBe(false)
    
    // click to open
    await trigger.trigger('click')
    expect(wrapper.find('.custom-select-dropdown').exists()).toBe(true)

    // click to close
    await trigger.trigger('click')
    // Vue transition might keep it in DOM for a moment, but isOpen becomes false
    // Since we mock or don't use real CSS transitions in simple tests, it might disappear immediately
    expect(wrapper.find('.custom-select-dropdown').exists()).toBe(false)
  })

  it('emits update:modelValue on option click', async () => {
    const wrapper = mount(CustomSelect, {
      props: { modelValue: '', options }
    })
    
    await wrapper.find('.custom-select-trigger').trigger('click')
    
    const optionButtons = wrapper.findAll('.select-option')
    expect(optionButtons).toHaveLength(3)
    
    await optionButtons[1].trigger('click')
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['opt2'])
  })

  it('supports keyboard navigation', async () => {
    const wrapper = mount(CustomSelect, {
      props: { modelValue: 'opt1', options }
    })
    
    const trigger = wrapper.find('.custom-select-trigger')
    
    // Open with ArrowDown
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.find('.custom-select-dropdown').exists()).toBe(true)
    
    await nextTick() // wait for DOM to update and refs to be set

    // We can test that events are fired on the options, but actual focus management 
    // in JSDOM is limited. We'll at least simulate emitting keydowns.
    const firstOption = wrapper.findAll('.select-option')[0]
    await firstOption.trigger('keydown', { key: 'ArrowDown' })
    // It should focus next item, but since focus testing is hard in jest/vitest without attached DOM,
    // we just ensure it doesn't crash and handlers are reachable.

    await firstOption.trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('.custom-select-dropdown').exists()).toBe(false)
  })
})
