import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FormatEditor from '../FormatEditor.vue';
import i18n from '@/i18n';
import type { BranchFormatTemplate } from '@/core/FormatTypes';

describe('FormatEditor.vue', () => {
  const dummyFormat: BranchFormatTemplate = {
    id: 'test-select-format',
    name: 'Test Select Format',
    templateString: '{type}',
    isReadonly: false,
    language: 'es',
    fields: [
      {
        id: 'type',
        label: 'Tipo',
        type: 'select',
        options: ['feature', 'fix'],
        capitalization: 'LOWERCASE',
      },
    ],
  };

  it('allows typing trailing commas in select options input without losing the comma', async () => {
    const wrapper = mount(FormatEditor, {
      global: { plugins: [i18n] },
      props: { format: dummyFormat },
    });

    const optionsInput = wrapper.find('.field-options-control input');
    expect(optionsInput.exists()).toBe(true);
    expect((optionsInput.element as HTMLInputElement).value).toBe('feature, fix');

    // Simulate user typing "feature, fix," (trailing comma)
    await optionsInput.setValue('feature, fix,');

    // Value displayed in the input MUST preserve the comma
    expect((optionsInput.element as HTMLInputElement).value).toBe('feature, fix,');
  });
});
