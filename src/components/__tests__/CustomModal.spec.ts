import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CustomModal from '../CustomModal.vue';
import i18n from '@/i18n';

describe('CustomModal', () => {
  it('renders nothing when modelValue is false', () => {
    const wrapper = mount(CustomModal, {
      global: { plugins: [i18n] },
      props: {
        modelValue: false,
        title: 'Test',
        message: 'Message',
      },
    });
    expect(wrapper.find('.modal-overlay').exists()).toBe(false);
  });

  it('renders modal content when modelValue is true', () => {
    const wrapper = mount(CustomModal, {
      global: { plugins: [i18n] },
      props: {
        modelValue: true,
        title: 'Test Title',
        message: 'Test Message',
      },
    });
    expect(wrapper.find('.modal-overlay').exists()).toBe(true);
    expect(wrapper.text()).toContain('Test Title');
    expect(wrapper.text()).toContain('Test Message');
  });

  it('emits confirm event when confirm button is clicked', async () => {
    const wrapper = mount(CustomModal, {
      global: { plugins: [i18n] },
      props: {
        modelValue: true,
        title: 'Test',
        message: 'Message',
      },
    });
    await wrapper.find('.btn-primary').trigger('click');
    expect(wrapper.emitted('confirm')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false]);
  });

  it('emits cancel event when cancel button is clicked', async () => {
    const wrapper = mount(CustomModal, {
      global: { plugins: [i18n] },
      props: {
        modelValue: true,
        title: 'Test',
        message: 'Message',
      },
    });
    await wrapper.find('.btn-secondary').trigger('click');
    expect(wrapper.emitted('cancel')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false]);
  });

  it('applies danger class to confirm button if danger prop is true', () => {
    const wrapper = mount(CustomModal, {
      global: { plugins: [i18n] },
      props: {
        modelValue: true,
        title: 'Test',
        message: 'Message',
        danger: true,
      },
    });
    expect(wrapper.find('.btn-danger').exists()).toBe(true);
    expect(wrapper.find('.btn-primary').exists()).toBe(false);
  });
});
