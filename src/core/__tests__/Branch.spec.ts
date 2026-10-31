import { describe, expect, it } from 'vitest';
import { Branch } from '../Branch';

describe('Branch', () => {
  it('should create a Branch instance with formatted branchName', () => {
    const branchData = {
      id: 1,
      branchName: 'PROJ-TICKET-123--New-Feature',
      formatId: 'default',
    };

    const branch = new Branch(branchData);

    expect(branch.id).toBe(1);
    expect(branch.branchName).toBe('PROJ-TICKET-123--New-Feature');
    expect(branch.formatId).toBe('default');
  });
});
