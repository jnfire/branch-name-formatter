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
