import type { BranchFormatTemplate, Capitalization, LanguageProfile } from '@/core/FormatTypes';
import type { BranchFormType } from '@/core/BranchTypes';

interface LanguageRules {
  slashWord: string; // "/" se sustituye por "-{slashWord}-"
  charMap?: [RegExp, string][]; // sustituciones específicas del idioma que deben aplicarse antes de quitar tildes
}

const LANGUAGE_RULES: Record<LanguageProfile, LanguageRules> = {
  es: {
    slashWord: 'o',
    charMap: [
      [/ñ/g, 'ny'],
      [/Ñ/g, 'NY'],
    ],
  },
  en: { slashWord: 'or' },
  fr: { slashWord: 'ou' },
  de: { slashWord: 'oder', charMap: [[/ß/g, 'ss']] },
  it: { slashWord: 'o' },
  pt: { slashWord: 'ou' },
};

/**
 * A piece of a generated branch name: either the value of one field of the
 * format (with its position, so the UI can color it) or literal text of the
 * template, such as the separators.
 */
export type NameSegment =
  { kind: 'field'; fieldId: string; index: number; text: string } | { kind: 'text'; text: string };

export class BranchFormatter {
  static format(template: BranchFormatTemplate, values: BranchFormType): string {
    let result = template.templateString;

    for (const field of template.fields) {
      const rawValue = values[field.id] || '';
      const sanitized = this.sanitize(rawValue, template.language);
      const formattedValue = this.applyCapitalization(sanitized, field.capitalization);

      const placeholder = `{${field.id}}`;
      result = result.split(placeholder).join(formattedValue);
    }

    return this.removeLeadingAndTrailingDashes(result);
  }

  /**
   * Same name as `format`, split into segments. With `trim` (the default) the
   * leading and trailing dashes are removed exactly like `format` does, so the
   * texts of the segments joined give the same string. Without it, empty
   * fields keep their separators, which is what the live preview needs while
   * the form is still being filled in.
   */
  static formatSegments(
    template: BranchFormatTemplate,
    values: BranchFormType,
    trim = true,
  ): NameSegment[] {
    const fieldIndex = new Map(template.fields.map((field, index) => [field.id, index]));
    const segments: NameSegment[] = [];

    for (const part of template.templateString.split(/(\{[^{}]+\})/g)) {
      if (!part) continue;
      const match = /^\{([^{}]+)\}$/.exec(part);
      const index = match ? fieldIndex.get(match[1]) : undefined;
      if (index === undefined) {
        segments.push({ kind: 'text', text: part });
        continue;
      }
      const field = template.fields[index];
      const sanitized = this.sanitize(values[field.id] || '', template.language);
      segments.push({
        kind: 'field',
        fieldId: field.id,
        index,
        text: this.applyCapitalization(sanitized, field.capitalization),
      });
    }

    return trim ? this.trimSegments(segments) : segments;
  }

  private static trimSegments(segments: NameSegment[]): NameSegment[] {
    const trimmed = segments.map((segment) => ({ ...segment }));
    for (const segment of trimmed) {
      segment.text = segment.text.replace(/^-+/, '');
      if (segment.text) break;
    }
    for (let index = trimmed.length - 1; index >= 0; index -= 1) {
      trimmed[index].text = trimmed[index].text.replace(/-+$/, '');
      if (trimmed[index].text) break;
    }
    return trimmed;
  }

  // Saneado fijo: garantiza un nombre de rama válido en git, independientemente de la configuración del campo.
  private static sanitize(text: string, language: LanguageProfile): string {
    const rules = LANGUAGE_RULES[language];
    let result = text;

    result = result.replace(/\//g, `-${rules.slashWord}-`);
    for (const [pattern, replacement] of rules.charMap ?? []) {
      result = result.replace(pattern, replacement);
    }
    result = result.replace(/\./g, '-');
    result = result.replace(/\s/g, '-');
    result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    result = result.replace(/[^a-zA-Z0-9-]/g, '');
    result = result.replace(/-+/g, '-');

    return result;
  }

  private static applyCapitalization(text: string, capitalization: Capitalization): string {
    switch (capitalization) {
      case 'UPPERCASE':
        return text.toUpperCase();
      case 'LOWERCASE':
        return text.toLowerCase();
      default:
        return text;
    }
  }

  private static removeLeadingAndTrailingDashes(text: string): string {
    return text.replace(/^-+|-+$/g, '');
  }
}
