export type BranchFormType = Record<string, string>;

export interface BranchType {
  id: number;
  branchName: string;
  formatId?: string; // Optional: To know which format was used
}
