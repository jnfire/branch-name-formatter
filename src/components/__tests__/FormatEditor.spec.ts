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

  const mountEditor = (format = dummyFormat) =>
    mount(FormatEditor, { global: { plugins: [i18n] }, props: { format } });

  it('reports no changes until something is edited', async () => {
    const wrapper = mountEditor();
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('dirty-change')).toBeUndefined();

    await wrapper.find('#format-name-input').setValue('Otro nombre');
    expect(wrapper.emitted('dirty-change')!.at(-1)).toEqual([true]);
  });

  it('reports no changes again when the edit is undone', async () => {
    const wrapper = mountEditor();
    await wrapper.find('#format-name-input').setValue('Otro nombre');
    await wrapper.find('#format-name-input').setValue('Test Select Format');
    expect(wrapper.emitted('dirty-change')!.at(-1)).toEqual([false]);
  });

  it('warns about a token that matches no field', async () => {
    const wrapper = mountEditor();
    expect(wrapper.find('#format-template-warnings').exists()).toBe(false);

    await wrapper.find('#format-template-input').setValue('{typo}');
    const warnings = wrapper.find('#format-template-warnings');
    expect(warnings.exists()).toBe(true);
    expect(warnings.text()).toContain('{typo}');
  });

  it('does not block saving a format with warnings', async () => {
    const wrapper = mountEditor();
    await wrapper.find('#format-template-input').setValue('{typo}');
    await wrapper.find('.btn-primary').trigger('click');
    expect(wrapper.emitted('save')![0][0]).toMatchObject({ templateString: '{typo}' });
  });

  it('emits cancel from the cancel button', async () => {
    const wrapper = mountEditor();
    await wrapper.find('.ed-actions .btn-secondary').trigger('click');
    expect(wrapper.emitted('cancel')).toHaveLength(1);
  });

  it('shows how a typed example turns out with the capitalization and language of the format', async () => {
    const wrapper = mountEditor();
    await wrapper.find('.try-grid input').setValue('Añadir Ñoño');
    expect(wrapper.find('.output-name').text()).toBe('anyadir-nyonyo');
  });
});
