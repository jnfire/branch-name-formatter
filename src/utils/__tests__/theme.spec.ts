import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getTheme, setTheme, applyTheme, initTheme } from '../theme';

describe('Theme Utility Module', () => {
  const STORAGE_KEY = 'app-theme';
  let mockStorage: Record<string, string> = {};
  let mockAttributes: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    mockAttributes = {};

    globalThis.localStorage = {
      getItem: (key: string) => mockStorage[key] ?? null,
      setItem: (key: string, value: string) => {
        mockStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
      clear: () => {
        mockStorage = {};
      },
      key: () => null,
      length: 0,
    };

    (globalThis as unknown as { document: unknown }).document = {
      documentElement: {
        getAttribute: (name: string) => mockAttributes[name] ?? null,
        setAttribute: (name: string, value: string) => {
          mockAttributes[name] = value;
        },
        removeAttribute: (name: string) => {
          delete mockAttributes[name];
        },
        hasAttribute: (name: string) => name in mockAttributes,
      },
    };

    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getTheme', () => {
    it('returns "system" when no theme is saved in localStorage', () => {
      expect(getTheme()).toBe('system');
    });

    it('returns "light" when "light" is stored', () => {
      globalThis.localStorage.setItem(STORAGE_KEY, 'light');
      expect(getTheme()).toBe('light');
    });

    it('returns "dark" when "dark" is stored', () => {
      globalThis.localStorage.setItem(STORAGE_KEY, 'dark');
      expect(getTheme()).toBe('dark');
    });

    it('returns "system" when "system" is stored', () => {
      globalThis.localStorage.setItem(STORAGE_KEY, 'system');
      expect(getTheme()).toBe('system');
    });

    it('returns fallback "system" when stored value is invalid', () => {
      globalThis.localStorage.setItem(STORAGE_KEY, 'invalid-theme-name');
      expect(getTheme()).toBe('system');
    });

    it('handles localStorage read exceptions gracefully and returns "system"', () => {
      vi.spyOn(globalThis.localStorage, 'getItem').mockImplementation(() => {
        throw new Error('Access denied to localStorage');
      });

      expect(getTheme()).toBe('system');
    });
  });

  describe('setTheme', () => {
    it('saves the theme in localStorage and applies it to documentElement', () => {
      setTheme('dark');
      expect(globalThis.localStorage.getItem(STORAGE_KEY)).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('handles localStorage write exceptions and still applies theme to documentElement', () => {
      vi.spyOn(globalThis.localStorage, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      setTheme('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  describe('applyTheme', () => {
    it('sets data-theme attribute to "light" when light theme is applied', () => {
      applyTheme('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('sets data-theme attribute to "dark" when dark theme is applied', () => {
      applyTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('removes data-theme attribute when "system" theme is applied', () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      applyTheme('system');
      expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    });
  });

  describe('initTheme', () => {
    it('initializes document theme based on stored preference', () => {
      globalThis.localStorage.setItem(STORAGE_KEY, 'dark');
      initTheme();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });
});
