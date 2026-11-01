export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'app-theme';

export const getTheme = (): Theme => {
  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
      return savedTheme;
    }
  } catch {
    // ignore
  }
  return 'system';
};

export const setTheme = (theme: Theme) => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore
  }
  applyTheme(theme);
};

export const applyTheme = (theme: Theme) => {
  if (typeof document === 'undefined') return;
  const rootElement = document.documentElement;
  if (theme === 'system') {
    rootElement.removeAttribute('data-theme');
  } else {
    rootElement.setAttribute('data-theme', theme);
  }
};

export const initTheme = () => {
  applyTheme(getTheme());
};
