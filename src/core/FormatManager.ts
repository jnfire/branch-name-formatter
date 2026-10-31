import type { BranchFormatTemplate, LanguageProfile } from '@/core/FormatTypes';
import { getUiLanguage, setUiLanguage, type SupportedLocale } from '@/i18n';

export class FormatManager {
  private static readonly STORAGE_KEY_CUSTOM = 'branch-formats-custom';
  private static readonly STORAGE_KEY_DEFAULT_FORMAT = 'branch-format-default-id';
  private static readonly STORAGE_KEY_PREDEFINED_LANGUAGE = 'branch-formats-predefined-language';

  private static readonly DEFAULT_FORMATS: BranchFormatTemplate[] = [
    {
      id: 'default-app',
      name: 'formats.defaultApp.name',
      templateString: '{projectId}-{ticketId}--{featureName}',
      isReadonly: true,
      language: 'es',
      fields: [
        {
          id: 'projectId',
          label: 'formats.defaultApp.projectId',
          type: 'text',
          capitalization: 'UPPERCASE',
        },
        {
          id: 'ticketId',
          label: 'formats.defaultApp.ticketId',
          type: 'text',
          capitalization: 'UPPERCASE',
        },
        {
          id: 'featureName',
          label: 'formats.defaultApp.featureName',
          type: 'text',
          capitalization: 'LOWERCASE',
        },
      ],
    },
    {
      id: 'gitflow',
      name: 'formats.gitflow.name',
      templateString: '{type}/{ticketId}-{description}',
      isReadonly: true,
      language: 'es',
      fields: [
        {
          id: 'type',
          label: 'formats.gitflow.type',
          type: 'select',
          options: ['feature', 'bugfix', 'hotfix', 'release', 'chore'],
          capitalization: 'LOWERCASE',
        },
        {
          id: 'ticketId',
          label: 'formats.gitflow.ticketId',
          type: 'text',
          capitalization: 'UPPERCASE',
        },
        {
          id: 'description',
          label: 'formats.gitflow.description',
          type: 'text',
          capitalization: 'LOWERCASE',
        },
      ],
    },
    {
      id: 'conventional-commits',
      name: 'formats.conventionalCommits.name',
      templateString: '{type}/{scope}/{description}',
      isReadonly: true,
      language: 'es',
      fields: [
        {
          id: 'type',
          label: 'formats.conventionalCommits.type',
          type: 'select',
          options: [
            'feat',
            'fix',
            'docs',
            'style',
            'refactor',
            'perf',
            'test',
            'build',
            'ci',
            'chore',
            'revert',
          ],
          capitalization: 'LOWERCASE',
        },
        {
          id: 'scope',
          label: 'formats.conventionalCommits.scope',
          type: 'text',
          capitalization: 'LOWERCASE',
        },
        {
          id: 'description',
          label: 'formats.conventionalCommits.description',
          type: 'text',
          capitalization: 'LOWERCASE',
        },
      ],
    },
  ];

  static getFormats(): BranchFormatTemplate[] {
    const customFormats = this.getCustomFormats();
    const languageOverrides = this.getPredefinedLanguageOverrides();

    const predefined = this.DEFAULT_FORMATS.map((format) => ({
      ...format,
      language: languageOverrides[format.id] ?? format.language,
    }));

    return [...predefined, ...customFormats];
  }

  static getVisibleFormats(): BranchFormatTemplate[] {
    return this.getFormats();
  }

  static getDefaultFormatId(): string | null {
    return localStorage.getItem(this.STORAGE_KEY_DEFAULT_FORMAT);
  }

  static setDefaultFormatId(id: string): void {
    localStorage.setItem(this.STORAGE_KEY_DEFAULT_FORMAT, id);
  }

  static getCustomFormats(): BranchFormatTemplate[] {
    const data = localStorage.getItem(this.STORAGE_KEY_CUSTOM);
    if (!data) return [];
    try {
      return JSON.parse(data) as BranchFormatTemplate[];
    } catch {
      return [];
    }
  }

  private static saveCustomFormats(formats: BranchFormatTemplate[]): void {
    localStorage.setItem(this.STORAGE_KEY_CUSTOM, JSON.stringify(formats));
  }

  private static getPredefinedLanguageOverrides(): Partial<Record<string, LanguageProfile>> {
    const data = localStorage.getItem(this.STORAGE_KEY_PREDEFINED_LANGUAGE);
    if (!data) return {};
    try {
      return JSON.parse(data) as Partial<Record<string, LanguageProfile>>;
    } catch {
      return {};
    }
  }

  private static savePredefinedLanguageOverrides(
    overrides: Partial<Record<string, LanguageProfile>>,
  ): void {
    localStorage.setItem(this.STORAGE_KEY_PREDEFINED_LANGUAGE, JSON.stringify(overrides));
  }

  static addFormat(format: BranchFormatTemplate): void {
    const custom = this.getCustomFormats();
    // ensure it's not readonly
    const newFormat = { ...format, isReadonly: false };
    custom.push(newFormat);
    this.saveCustomFormats(custom);
  }

  static updateFormat(updatedFormat: BranchFormatTemplate): void {
    const custom = this.getCustomFormats();
    const index = custom.findIndex((f) => f.id === updatedFormat.id);
    if (index !== -1) {
      custom[index] = { ...updatedFormat, isReadonly: false };
      this.saveCustomFormats(custom);
    }
  }

  static deleteFormat(id: string): void {
    const custom = this.getCustomFormats();
    const filtered = custom.filter((f) => f.id !== id);
    this.saveCustomFormats(filtered);
  }

  // Único ajuste editable en un formato predefinido (además de visible/predeterminado):
  // el idioma usado para el saneado de caracteres.
  static setLanguage(id: string, language: LanguageProfile): void {
    const custom = this.getCustomFormats();
    const customIndex = custom.findIndex((f) => f.id === id);

    if (customIndex !== -1) {
      custom[customIndex].language = language;
      this.saveCustomFormats(custom);
      return;
    }

    const isPredefined = this.DEFAULT_FORMATS.some((f) => f.id === id);
    if (isPredefined) {
      const overrides = this.getPredefinedLanguageOverrides();
      overrides[id] = language;
      this.savePredefinedLanguageOverrides(overrides);
    }
  }

  static cloneFormat(
    id: string,
    resolveLabel: (value: string) => string,
    cloneSuffix: string,
  ): BranchFormatTemplate | null {
    const allFormats = this.getFormats();
    const formatToClone = allFormats.find((f) => f.id === id);
    if (!formatToClone) return null;

    // Al clonar, se "hornean" los textos traducidos (nombre y etiquetas de campo):
    // el clon es un formato normal editable, no debe seguir arrastrando claves i18n.
    const newId = `custom-${Date.now()}`;
    const clonedFormat: BranchFormatTemplate = {
      ...JSON.parse(JSON.stringify(formatToClone)), // Deep clone for fields
      id: newId,
      name: `${resolveLabel(formatToClone.name)} ${cloneSuffix}`,
      isReadonly: false,
      fields: formatToClone.fields.map((field) => ({
        ...field,
        label: resolveLabel(field.label),
      })),
    };
    this.addFormat(clonedFormat);
    return clonedFormat;
  }

  static exportConfiguration(): string {
    const config = {
      version: 1,
      uiLanguage: getUiLanguage(),
      defaultFormatId: this.getDefaultFormatId(),
      formats: this.getFormats(),
    };
    return JSON.stringify(config, null, 2);
  }

  static exportCustomFormats(): string {
    return this.exportConfiguration();
  }

  static importCustomFormats(jsonString: string): void {
    try {
      const parsed = JSON.parse(jsonString);

      if (Array.isArray(parsed)) {
        this.importFormatsArray(parsed as BranchFormatTemplate[]);
        return;
      }

      if (typeof parsed === 'object' && parsed !== null) {
        if (parsed.uiLanguage && typeof parsed.uiLanguage === 'string') {
          setUiLanguage(parsed.uiLanguage as SupportedLocale);
        }

        if (parsed.defaultFormatId && typeof parsed.defaultFormatId === 'string') {
          this.setDefaultFormatId(parsed.defaultFormatId);
        }

        if (
          parsed.predefinedLanguageOverrides &&
          typeof parsed.predefinedLanguageOverrides === 'object'
        ) {
          const currentOverrides = this.getPredefinedLanguageOverrides();
          const newOverrides = { ...currentOverrides, ...parsed.predefinedLanguageOverrides };
          this.savePredefinedLanguageOverrides(newOverrides);
        }

        const formatsArray = Array.isArray(parsed.formats)
          ? parsed.formats
          : Array.isArray(parsed.customFormats)
            ? parsed.customFormats
            : [];

        if (formatsArray.length > 0) {
          this.importFormatsArray(formatsArray, true);
        }
      } else {
        throw new Error('Invalid format structure');
      }
    } catch (e) {
      console.error('Error importing formats:', e);
      throw e;
    }
  }

  private static importFormatsArray(
    formatsArray: BranchFormatTemplate[],
    processPredefined = true,
  ): void {
    const customToSave: BranchFormatTemplate[] = [...this.getCustomFormats()];
    const predefinedIds = this.DEFAULT_FORMATS.map((f) => f.id);

    for (const item of formatsArray) {
      if (predefinedIds.includes(item.id)) {
        if (processPredefined && item.language) {
          this.setLanguage(item.id, item.language);
        }
      } else {
        const existingIndex = customToSave.findIndex((c) => c.id === item.id);
        const formatItem: BranchFormatTemplate = {
          ...item,
          isReadonly: false,
        };
        if (existingIndex !== -1) {
          customToSave[existingIndex] = formatItem;
        } else {
          customToSave.push(formatItem);
        }
      }
    }

    this.saveCustomFormats(customToSave);
  }
}
