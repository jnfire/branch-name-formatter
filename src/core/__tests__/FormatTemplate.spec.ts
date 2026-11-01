import { describe, expect, it } from 'vitest';
import { checkTemplate, hasTemplateIssues } from '../FormatTemplate';

const fields = (...ids: string[]) =>
  ids.map((id) => ({ id, label: id, capitalization: 'AS_IS' as const }));

describe('checkTemplate', () => {
  it('finds nothing in a consistent template', () => {
    const issues = checkTemplate({ templateString: '{a}-{b}', fields: fields('a', 'b') });
    expect(hasTemplateIssues(issues)).toBe(false);
  });

  it('reports a token that matches no field', () => {
    const issues = checkTemplate({ templateString: '{a}-{isue}', fields: fields('a', 'issue') });
    expect(issues.unknownTokens).toEqual(['isue']);
    expect(issues.unusedFields).toEqual(['issue']);
  });

  it('reports a field that is not in the template', () => {
    const issues = checkTemplate({ templateString: '{a}', fields: fields('a', 'b') });
    expect(issues.unusedFields).toEqual(['b']);
    expect(hasTemplateIssues(issues)).toBe(true);
  });

  it('reports repeated field ids', () => {
    const issues = checkTemplate({ templateString: '{a}-{a}', fields: fields('a', 'a') });
    expect(issues.duplicateFields).toEqual(['a']);
  });

  it('ignores fields whose id is still empty', () => {
    const issues = checkTemplate({ templateString: '{a}', fields: fields('a', '') });
    expect(issues.unusedFields).toEqual([]);
  });
});
