import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BranchList from '@/components/BranchList.vue';
import BranchItem from '@/components/BranchItem.vue';
import { Branch } from '@/core/Branch';

describe('BranchList.vue', () => {
  it('renders a list of branch items including projectId', () => {
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

  it('updates the list when branches prop changes including projectId', async () => {
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
});
