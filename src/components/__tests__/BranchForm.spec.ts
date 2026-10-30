import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import BranchForm from '../BranchForm.vue';
import { FormatManager } from '@/core/FormatManager';
import i18n from '@/i18n';

import { nextTick } from 'vue';

// Mocking FormatManager for the tests
FormatManager.getFormats = () => [
  {
    id: 'test',
    name: 'Test',
    templateString: '{testId}',
    isReadonly: false,
    language: 'es',
    fields: [{ id: 'testId', label: 'Test ID', type: 'text', capitalization: 'AS_IS' }],
  },
];
FormatManager.getDefaultFormatId = () => 'test';

describe('BranchForm', () => {
  it('renders the dynamic form correctly', async () => {
    const wrapper = mount(BranchForm, {
      global: {
        plugins: [i18n],
      },
    });
    await nextTick();
    // Expect input with name testId to exist
    expect(wrapper.find('input[name="testId"]').exists()).toBe(true);
  });

  it('emits submitForm event with correct payload', async () => {
    const wrapper = mount(BranchForm, {
      global: {
        plugins: [i18n],
      },
    });
    await nextTick();

    const input = wrapper.find('input[name="testId"]');
    await input.setValue('my-test-value');
    await wrapper.find('form').trigger('submit');

    const emitted = wrapper.emitted('submitForm');
    expect(emitted).toBeTruthy();
    expect(emitted![0][1]).toEqual({ testId: 'my-test-value' });
  });
});
