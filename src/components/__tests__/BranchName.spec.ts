import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import BranchName from '../BranchName.vue';
import type { NameSegment } from '@/core/BranchFormatter';

const segments: NameSegment[] = [
  { kind: 'field', fieldId: 'a', index: 0, text: 'WEB' },
  { kind: 'text', text: '-' },
  { kind: 'field', fieldId: 'b', index: 1, text: '' },
];

describe('BranchName', () => {
  it('colors each field by its position and leaves the separators plain', () => {
    const wrapper = mount(BranchName, { props: { segments } });
    const field = wrapper.find('.seg');
    expect(field.text()).toBe('WEB');
    expect(field.attributes('style')).toContain('--seg-1');
    expect(wrapper.find('.sep').text()).toBe('-');
  });

  it('shows nothing for an empty field when no placeholders are given', () => {
    const wrapper = mount(BranchName, { props: { segments } });
    expect(wrapper.findAll('.seg')).toHaveLength(1);
  });

  it('shows the placeholder of an empty field, dashed', () => {
    const wrapper = mount(BranchName, {
      props: { segments, placeholders: ['Proyecto', 'Ticket'] },
    });
    expect(wrapper.find('.seg.ghost').text()).toBe('Ticket');
  });

  it('cycles the palette after six fields', () => {
    const many: NameSegment[] = [{ kind: 'field', fieldId: 'g', index: 6, text: 'x' }];
    const wrapper = mount(BranchName, { props: { segments: many } });
    expect(wrapper.find('.seg').attributes('style')).toContain('--seg-1');
  });
});
