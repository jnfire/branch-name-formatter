import { describe, expect, it } from 'vitest';
import { BranchFormatter } from '../BranchFormatter';
import type { BranchFormatTemplate } from '../FormatTypes';

describe('BranchFormatter', () => {
  const dummyTemplate: BranchFormatTemplate = {
    id: 'test',
    name: 'Test',
    templateString: '{projectId}-{ticketId}--{featureName}',
    isReadonly: true,
    language: 'es',
    fields: [
      { id: 'projectId', label: 'ID', capitalization: 'UPPERCASE' },
      { id: 'ticketId', label: 'TICKET', capitalization: 'UPPERCASE' },
      { id: 'featureName', label: 'FEATURE', capitalization: 'LOWERCASE' },
    ],
  };

  it('should sanitize and apply capitalization correctly', () => {
    const values = {
      projectId: 'proj',
      ticketId: 't-123',
      featureName: 'My/Feature Name',
    };
    const result = BranchFormatter.format(dummyTemplate, values);
    expect(result).toBe('PROJ-T-123--my-o-feature-name');
  });

  it('should remove multiple dashes', () => {
    const values = {
      projectId: 'PROJ',
      ticketId: '123',
      featureName: 'my----feature',
    };
    const result = BranchFormatter.format(dummyTemplate, values);
    expect(result).toBe('PROJ-123--my-feature');
  });

  it('should replace ñ and accents (es)', () => {
    const values = {
      projectId: 'prój',
      ticketId: 'tíckët',
      featureName: 'niño',
    };
    const result = BranchFormatter.format(dummyTemplate, values);
    expect(result).toBe('PROJ-TICKET--ninyo');
  });

  it('should respect AS_IS capitalization', () => {
    const template: BranchFormatTemplate = {
      ...dummyTemplate,
      fields: [
        { id: 'projectId', label: 'ID', capitalization: 'AS_IS' },
        { id: 'ticketId', label: 'TICKET', capitalization: 'AS_IS' },
        { id: 'featureName', label: 'FEATURE', capitalization: 'AS_IS' },
      ],
    };
    const result = BranchFormatter.format(template, {
      projectId: 'Proj',
      ticketId: 'T-123',
      featureName: 'MixedCase',
    });
    expect(result).toBe('Proj-T-123--MixedCase');
  });

  it('should use the language profile to translate the slash word', () => {
    const template: BranchFormatTemplate = { ...dummyTemplate, language: 'en' };
    const result = BranchFormatter.format(template, {
      projectId: 'proj',
      ticketId: '1',
      featureName: 'a/b',
    });
    expect(result).toBe('PROJ-1--a-or-b');
  });

  it.each([
    ['es', 'o'],
    ['en', 'or'],
    ['fr', 'ou'],
    ['de', 'oder'],
    ['it', 'o'],
    ['pt', 'ou'],
  ] as const)('translates "/" to "-%s-" for language %s', (language, slashWord) => {
    const template: BranchFormatTemplate = { ...dummyTemplate, language };
    const result = BranchFormatter.format(template, {
      projectId: 'proj',
      ticketId: '1',
      featureName: 'a/b',
    });
    expect(result).toBe(`PROJ-1--a-${slashWord}-b`);
  });

  it('should replace ß with ss (de)', () => {
    const template: BranchFormatTemplate = { ...dummyTemplate, language: 'de' };
    const result = BranchFormatter.format(template, {
      projectId: 'proj',
      ticketId: '1',
      featureName: 'straße/api',
    });
    expect(result).toBe('PROJ-1--strasse-oder-api');
  });

  it('should sanitize accents properly in Spanish (es)', () => {
    const template: BranchFormatTemplate = { ...dummyTemplate, language: 'es' };
    const result = BranchFormatter.format(template, {
      projectId: 'proj',
      ticketId: '1',
      featureName: 'áéíóúñÁÉÍÓÚÑ',
    });
    expect(result).toBe('PROJ-1--aeiounyaeiouny');
  });

  it('should sanitize accents properly in French (fr)', () => {
    const template: BranchFormatTemplate = { ...dummyTemplate, language: 'fr' };
    const result = BranchFormatter.format(template, {
      projectId: 'proj',
      ticketId: '1',
      featureName: 'éèàùçâêîôûëïü',
    });
    // Note: ç normalizes to c, â -> a, ê -> e, î -> i, ô -> o, û -> u, ë -> e, ï -> i, ü -> u
    // 'éèàùçâêîôûëïü' -> 'eeaucaeioueiu' after standard unicode normalization & sanitization
    expect(result).toBe('PROJ-1--eeaucaeioueiu');
  });

  it('should sanitize accents and umlauts properly in German (de)', () => {
    const template: BranchFormatTemplate = { ...dummyTemplate, language: 'de' };
    const result = BranchFormatter.format(template, {
      projectId: 'proj',
      ticketId: '1',
      featureName: 'äöüßÄÖÜ',
    });
    expect(result).toBe('PROJ-1--aoussaou');
  });

  it('should sanitize accents properly in Italian (it)', () => {
    const template: BranchFormatTemplate = { ...dummyTemplate, language: 'it' };
    const result = BranchFormatter.format(template, {
      projectId: 'proj',
      ticketId: '1',
      featureName: 'àèéìòù',
    });
    expect(result).toBe('PROJ-1--aeeiou');
  });

  it('should sanitize accents and cedilla properly in Portuguese (pt)', () => {
    const template: BranchFormatTemplate = { ...dummyTemplate, language: 'pt' };
    const result = BranchFormatter.format(template, {
      projectId: 'proj',
      ticketId: '1',
      featureName: 'áàâãéêíóôõúç',
    });
    // á, à, â, ã -> a, a, a, a (4 'a's)
    expect(result).toBe('PROJ-1--aaaaeeiooouc');
  });
});

describe('BranchFormatter.formatSegments', () => {
  const template: BranchFormatTemplate = {
    id: 'seg',
    name: 'Seg',
    templateString: '{projectId}-{ticketId}--{featureName}',
    isReadonly: true,
    language: 'es',
    fields: [
      { id: 'projectId', label: 'ID', capitalization: 'UPPERCASE' },
      { id: 'ticketId', label: 'TICKET', capitalization: 'UPPERCASE' },
      { id: 'featureName', label: 'FEATURE', capitalization: 'LOWERCASE' },
    ],
  };

  it('splits the name into field values and literal text', () => {
    const segments = BranchFormatter.formatSegments(template, {
      projectId: 'web',
      ticketId: '487',
      featureName: 'Login con SSO',
    });
    expect(segments).toEqual([
      { kind: 'field', fieldId: 'projectId', index: 0, text: 'WEB' },
      { kind: 'text', text: '-' },
      { kind: 'field', fieldId: 'ticketId', index: 1, text: '487' },
      { kind: 'text', text: '--' },
      { kind: 'field', fieldId: 'featureName', index: 2, text: 'login-con-sso' },
    ]);
  });

  it.each([
    { projectId: 'web', ticketId: '487', featureName: 'Añadir/Login Ñoño' },
    { projectId: '-web', ticketId: '487', featureName: '-x-' },
    { projectId: 'web', ticketId: '', featureName: '' },
    { projectId: '', ticketId: '', featureName: '' },
  ])('joined texts equal format() for %o', (values) => {
    const joined = BranchFormatter.formatSegments(template, values)
      .map((segment) => segment.text)
      .join('');
    expect(joined).toBe(BranchFormatter.format(template, values));
  });

  it('keeps the separators of empty fields when not trimming', () => {
    const segments = BranchFormatter.formatSegments(
      template,
      { projectId: 'web', ticketId: '487', featureName: '' },
      false,
    );
    expect(segments.map((segment) => segment.text).join('')).toBe('WEB-487--');
  });

  it('prints a token that matches no field as literal text', () => {
    const segments = BranchFormatter.formatSegments(
      { ...template, templateString: '{projectId}-{nope}' },
      { projectId: 'web' },
    );
    expect(segments.map((segment) => segment.text).join('')).toBe('WEB-{nope}');
  });
});
