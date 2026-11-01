import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import BranchForm from '../BranchForm.vue';
import i18n from '@/i18n';
import type { BranchFormatTemplate } from '@/core/FormatTypes';

const formats: BranchFormatTemplate[] = [
  {
    id: 'test',
    name: 'Test',
    templateString: '{testId}',
    isReadonly: false,
    language: 'es',
    fields: [{ id: 'testId', label: 'Test ID', type: 'text', capitalization: 'AS_IS' }],
  },
  {
    id: 'typed',
    name: 'Typed',
    templateString: '{kind}/{what}',
    isReadonly: false,
    language: 'es',
    fields: [
      {
        id: 'kind',
        label: 'Kind',
        type: 'select',
        options: ['feat', 'fix'],
        capitalization: 'AS_IS',
      },
      { id: 'what', label: 'What', type: 'text', capitalization: 'LOWERCASE' },
    ],
  },
];

const mountForm = (formatId = 'test', modelValue: Record<string, string> = {}) =>
  mount(BranchForm, {
    props: { formats, formatId, modelValue },
    global: { plugins: [i18n] },
  });

describe('BranchForm', () => {
  it('renders one input per field of the selected format', () => {
    const wrapper = mountForm();
    expect(wrapper.find('input[name="testId"]').exists()).toBe(true);
  });

  it('shows the template of the format under the selector', () => {
    const wrapper = mountForm('typed');
    expect(wrapper.find('.format-meta').text()).toBe('{kind}/{what}');
  });

  it('emits the new values while typing', async () => {
    const wrapper = mountForm('test', { testId: 'a' });
    await wrapper.find('input[name="testId"]').setValue('my-test-value');
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([{ testId: 'my-test-value' }]);
  });

  it('keeps the other values when one field changes', async () => {
    const wrapper = mountForm('typed', { kind: 'fix', what: '' });
    await wrapper.find('input[name="what"]').setValue('login');
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([{ kind: 'fix', what: 'login' }]);
  });

  it('emits submit when the form is submitted', async () => {
    const wrapper = mountForm();
    await wrapper.find('form').trigger('submit');
    expect(wrapper.emitted('submit')).toHaveLength(1);
  });

  it('asks to manage formats from the link next to the selector', async () => {
    const wrapper = mountForm();
    await wrapper.find('.link-btn').trigger('click');
    expect(wrapper.emitted('manage')).toHaveLength(1);
  });
});
