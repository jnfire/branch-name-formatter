import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BranchList from '@/components/BranchList.vue';
import BranchItem from '@/components/BranchItem.vue';
import { Branch } from '@/core/Branch';

describe('BranchList.vue', () => {
  it('renders a list of branch items', () => {
    const branches: Branch[] = [
      new Branch({
        id: 1,
        branchName: 'T1-Feature1',
      }),
      new Branch({
        id: 2,
        branchName: 'T2-Feature2',
      }),
      new Branch({
        id: 3,
        branchName: 'T3-Feature3',
      }),
    ];

    const wrapper = mount(BranchList, {
      props: { branches },
      global: { mocks: { $t: (msg: string) => msg } },
    });

    const items = wrapper.findAllComponents(BranchItem);
    expect(items).toHaveLength(branches.length);

    items.forEach((item, index) => {
      expect(item.props('branchName')).toBe(branches[index].branchName);
    });
  });

  it('updates the list when branches prop changes', async () => {
    const branches: Branch[] = [
      new Branch({
        id: 1,
        branchName: 'T1-Feature1',
      }),
      new Branch({
        id: 2,
        branchName: 'T2-Feature2',
      }),
    ];

    const wrapper = mount(BranchList, {
      props: { branches },
      global: { mocks: { $t: (msg: string) => msg } },
    });

    let items = wrapper.findAllComponents(BranchItem);
    expect(items).toHaveLength(branches.length);

    const newBranches: Branch[] = [
      new Branch({
        id: 1,
        branchName: 'T1-Feature1',
      }),
      new Branch({
        id: 2,
        branchName: 'T2-Feature2',
      }),
      new Branch({
        id: 3,
        branchName: 'T3-Feature3',
      }),
    ];

    await wrapper.setProps({ branches: newBranches });

    items = wrapper.findAllComponents(BranchItem);
    expect(items).toHaveLength(newBranches.length);

    items.forEach((item, index) => {
      expect(item.props('branchName')).toBe(newBranches[index].branchName);
    });
  });

  it('emits deleteBranch event when handleDeleteBranch is called', async () => {
    const branches: Branch[] = [
      new Branch({
        id: 1,
        branchName: 'T1-Feature1',
      }),
    ];

    const wrapper = mount(BranchList, {
      props: { branches },
      global: { mocks: { $t: (msg: string) => msg } },
    });

    await wrapper.findComponent(BranchItem).vm.$emit('deleteBranch', 1);

    expect(wrapper.emitted('deleteBranch')).toBeTruthy();
    expect(wrapper.emitted('deleteBranch')![0]).toEqual([1]);
  });
});

describe('BranchItem.vue', () => {
  it('renders branch item correctly', () => {
    const branch = new Branch({
      id: 1,
      branchName: 'T1-Feature1',
    });

    const wrapper = mount(BranchItem, {
      props: {
        branchName: branch.branchName,
        branchId: branch.id,
      },
      global: { mocks: { $t: (msg: string) => msg } },
    });

    expect(wrapper.text()).toContain(branch.branchName);
  });

  it('emits deleteBranch with its id from the delete button', async () => {
    const wrapper = mount(BranchItem, {
      props: { branchName: 'T1-Feature1', branchId: 7 },
      global: { mocks: { $t: (msg: string) => msg } },
    });

    await wrapper.find('.icon-btn.danger').trigger('click');

    expect(wrapper.emitted('deleteBranch')![0]).toEqual([7]);
  });

  it('marks the highlighted item', () => {
    const wrapper = mount(BranchItem, {
      props: { branchName: 'T1-Feature1', branchId: 1, highlight: true },
      global: { mocks: { $t: (msg: string) => msg } },
    });

    expect(wrapper.classes()).toContain('is-new');
  });
});
