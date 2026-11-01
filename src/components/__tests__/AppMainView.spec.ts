import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AppMainView from '../AppMainView.vue';
import { BranchManager } from '@/core/BranchManager';
import { FormatManager } from '@/core/FormatManager';
import i18n from '@/i18n';

const writeText = vi.fn().mockResolvedValue(undefined);

const mountView = () => mount(AppMainView, { global: { plugins: [i18n] } });

describe('AppMainView', () => {
  beforeEach(() => {
    localStorage.clear();
    BranchManager.getInstance().clearBranches();
    writeText.mockClear();
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  });

  it('cannot copy until every field is filled in', async () => {
    const wrapper = mountView();
    const copy = wrapper.find('.output-actions .btn-primary');
    expect(copy.attributes('disabled')).toBeDefined();

    await wrapper.find('input[name="projectId"]').setValue('web');
    await wrapper.find('input[name="ticketId"]').setValue('487');
    expect(copy.attributes('disabled')).toBeDefined();

    await wrapper.find('input[name="featureName"]').setValue('Login con SSO');
    expect(copy.attributes('disabled')).toBeUndefined();
  });

  it('updates the name while typing', async () => {
    const wrapper = mountView();
    await wrapper.find('input[name="projectId"]').setValue('web');
    expect(wrapper.find('.output-name .seg').text()).toBe('WEB');
  });

  it('copies the name and saves it to the history', async () => {
    const wrapper = mountView();
    await wrapper.find('input[name="projectId"]').setValue('web');
    await wrapper.find('input[name="ticketId"]').setValue('487');
    await wrapper.find('input[name="featureName"]').setValue('Login con SSO');

    await wrapper.find('.output-actions .btn-primary').trigger('click');
    await flushPromises();

    expect(writeText).toHaveBeenCalledWith('WEB-487--login-con-sso');
    expect(wrapper.find('.hist-name').text()).toBe('WEB-487--login-con-sso');
    expect(wrapper.find('.hist-row').classes()).toContain('is-new');
  });

  it('does not repeat the same name in the history', async () => {
    const wrapper = mountView();
    await wrapper.find('input[name="projectId"]').setValue('web');
    await wrapper.find('input[name="ticketId"]').setValue('487');
    await wrapper.find('input[name="featureName"]').setValue('x');

    await wrapper.find('.output-actions .btn-primary').trigger('click');
    await flushPromises();
    await wrapper.find('.output-actions .btn-primary').trigger('click');
    await flushPromises();

    expect(wrapper.findAll('.hist-row')).toHaveLength(1);
  });

  it('keeps the chosen format for the next visit', async () => {
    const wrapper = mountView();
    const other = FormatManager.getFormats()[1];
    await wrapper.findComponent({ name: 'BranchForm' }).vm.$emit('update:formatId', other.id);
    expect(FormatManager.getDefaultFormatId()).toBe(other.id);

    const next = mountView();
    expect(next.find('.format-meta').text()).toBe(other.templateString);
  });

  it('deletes a name from the history', async () => {
    const manager = BranchManager.getInstance();
    manager.createBranch({ branchName: 'A-1--a' });
    const wrapper = mountView();
    expect(wrapper.findAll('.hist-row')).toHaveLength(1);

    await wrapper.find('.icon-btn.danger').trigger('click');
    expect(wrapper.findAll('.hist-row')).toHaveLength(0);
    expect(wrapper.find('.hist-empty').exists()).toBe(true);
  });
});
