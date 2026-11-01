import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import FormatsView from '../FormatsView.vue';
import { FormatManager } from '@/core/FormatManager';
import i18n from '@/i18n';

const goTo = async (hash: string) => {
  window.location.hash = hash;
  window.dispatchEvent(new HashChangeEvent('hashchange'));
  await new Promise((resolve) => setTimeout(resolve, 0));
};

const mountView = () =>
  mount(FormatsView, { global: { plugins: [i18n] }, attachTo: document.body });

describe('FormatsView', () => {
  beforeEach(async () => {
    localStorage.clear();
    await goTo('#/formatos');
  });

  it('lists every format and shows the one in use first', () => {
    const wrapper = mountView();
    expect(wrapper.findAll('.fm-row')).toHaveLength(FormatManager.getFormats().length);
    expect(wrapper.find('.fm-row.is-open .chip.is-use').exists()).toBe(true);
    wrapper.unmount();
  });

  it('opens a built-in format read-only, with a way to clone it', async () => {
    const wrapper = mountView();
    expect(wrapper.find('.note').exists()).toBe(true);
    expect(wrapper.find('.ed-actions').exists()).toBe(false);
    expect(wrapper.find('.dp-actions').text()).toContain(i18n.global.t('formats.cloneToEdit'));
    wrapper.unmount();
  });

  it('clones a built-in format into an editable one', async () => {
    const wrapper = mountView();
    const before = FormatManager.getCustomFormats().length;
    await wrapper.find('.dp-actions .btn-secondary:last-child').trigger('click');
    expect(FormatManager.getCustomFormats()).toHaveLength(before + 1);
    wrapper.unmount();
  });

  it('starts a new format from the create button', async () => {
    const wrapper = mountView();
    await wrapper.find('.fm-list .btn-primary').trigger('click');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(window.location.hash).toBe('#/formatos/nuevo');
    expect(wrapper.find('#format-name-input').exists()).toBe(true);
    wrapper.unmount();
  });

  it('saves a new format and opens it', async () => {
    await goTo('#/formatos/nuevo');
    const wrapper = mountView();
    await wrapper.find('#format-name-input').setValue('Mi formato');
    await wrapper.find('.ed-actions .btn-primary').trigger('click');
    await new Promise((resolve) => setTimeout(resolve, 0));

    const saved = FormatManager.getCustomFormats().find((f) => f.name === 'Mi formato');
    expect(saved).toBeDefined();
    expect(window.location.hash).toBe(`#/formatos/${saved!.id}`);
    wrapper.unmount();
  });

  it('marks another format as the one in use', async () => {
    const wrapper = mountView();
    const other = FormatManager.getFormats()[1];
    await wrapper.findAll('.fm-row')[1].trigger('click');
    await new Promise((resolve) => setTimeout(resolve, 0));

    await wrapper.find('.dp-actions .btn-secondary').trigger('click');
    expect(FormatManager.getDefaultFormatId()).toBe(other.id);
    wrapper.unmount();
  });
});
