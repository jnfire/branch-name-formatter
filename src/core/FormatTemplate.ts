import type { BranchFormatTemplate } from '@/core/FormatTypes';

export interface TemplateIssues {
  /** Tokens in the template, such as `{isue}`, that match no field. */
  unknownTokens: string[];
  /** Fields that never appear in the template. */
  unusedFields: string[];
  /** Field ids used by more than one field. */
  duplicateFields: string[];
}

const unique = (values: string[]) => [...new Set(values)];

/**
 * Looks for the mistakes that make a format produce odd names: a token that
 * matches no field is printed as it is, and a field that is not in the
 * template is asked for in the form but never used.
 */
export function checkTemplate(
  format: Pick<BranchFormatTemplate, 'templateString' | 'fields'>,
): TemplateIssues {
  const tokens = [...format.templateString.matchAll(/\{([^{}]+)\}/g)].map((match) => match[1]);
  const ids = format.fields.map((field) => field.id);
  return {
    unknownTokens: unique(tokens.filter((token) => !ids.includes(token))),
    unusedFields: unique(ids.filter((id) => id && !tokens.includes(id))),
    duplicateFields: unique(ids.filter((id, index) => ids.indexOf(id) !== index)),
  };
}

export function hasTemplateIssues(issues: TemplateIssues): boolean {
  return (
    issues.unknownTokens.length > 0 ||
    issues.unusedFields.length > 0 ||
    issues.duplicateFields.length > 0
  );
}
