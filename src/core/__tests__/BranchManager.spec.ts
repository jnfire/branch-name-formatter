import { beforeEach, describe, expect, it } from 'vitest';
import { BranchManager } from '../BranchManager';

describe('BranchManager', () => {
  let manager: BranchManager;

  beforeEach(() => {
    localStorage.clear();
    manager = BranchManager.getInstance();
    manager.clearBranches();
  });

  it('should be a singleton', () => {
    const manager2 = BranchManager.getInstance();
    expect(manager).toBe(manager2);
  });

  it('should add a new branch', () => {
    manager.createBranch({
      branchName: 'PROJ-123--new-feature',
      formatId: 'default',
    });

    const branches = manager.getBranches();
    expect(branches).toHaveLength(1);
    expect(branches[0].branchName).toBe('PROJ-123--new-feature');
  });

  it('should sort branches in ascending order', () => {
    manager.createBranch({ branchName: 'B1' });
    manager.createBranch({ branchName: 'B2' });

    const branches = manager.getBranches(false);
    expect(branches[0].branchName).toBe('B1');
    expect(branches[1].branchName).toBe('B2');
  });

  it('should sort branches in descending order', () => {
    manager.createBranch({ branchName: 'B1' });
    manager.createBranch({ branchName: 'B2' });

    const branches = manager.getBranches();
    expect(branches[0].branchName).toBe('B2');
    expect(branches[1].branchName).toBe('B1');
  });

  it('should keep only the last 10 branches', () => {
    for (let i = 0; i < 15; i++) {
      manager.createBranch({ branchName: `B${i}` });
    }

    const branches = manager.getBranches();
    expect(branches).toHaveLength(10);
    // The most recent ones (highest IDs) should be kept
    expect(branches[0].branchName).toBe('B14');
    expect(branches[9].branchName).toBe('B5');
  });

  it('should delete a branch', () => {
    manager.createBranch({ branchName: 'B1' });
    const branches = manager.getBranches();
    const id = branches[0].id;

    const deleted = manager.deleteBranch(id);
    expect(deleted).toBe(true);
    expect(manager.getBranches()).toHaveLength(0);
  });

  it('should maintain retrocompatibility with old branch format in localstorage', () => {
    localStorage.setItem(
      'branches',
      JSON.stringify([
        {
          id: 1,
          projectId: 'OLD',
          ticketId: '123',
          featureName: 'feature',
        },
      ]),
    );

    // need to recreate manager to force load
    const managerSingleton = BranchManager as unknown as { instance: BranchManager | undefined };
    const tempManager = managerSingleton.instance;
    managerSingleton.instance = undefined;
    const newManager = BranchManager.getInstance();

    const branches = newManager.getBranches();
    expect(branches).toHaveLength(1);
    expect(branches[0].branchName).toBe('OLD-123--feature');

    // restore instance
    managerSingleton.instance = tempManager;
  });
});
