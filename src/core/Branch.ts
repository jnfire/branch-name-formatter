import type { BranchType } from '@/core/BranchTypes';

export class Branch implements BranchType {
  id: number;
  branchName: string;
  formatId?: string;

  constructor(branch: BranchType) {
    this.id = branch.id;
    this.branchName = branch.branchName;
    this.formatId = branch.formatId;
  }
}
