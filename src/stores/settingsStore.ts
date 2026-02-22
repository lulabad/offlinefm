import { create } from 'zustand';
import type { ThemeMode } from '@/types';
import i18n from '@/i18n';

interface SettingsState {
  theme: ThemeMode;
  language: string;

  // Actions
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setLanguage: (lang: string) => void;
  loadSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: (localStorage.getItem('offlinefm_theme') as ThemeMode) || 'system',
  language: localStorage.getItem('offlinefm_lang') || 'en',

  setTheme: (theme) => {
    localStorage.setItem('offlinefm_theme', theme);
    set({ theme });
    applyTheme(theme);
  },

  toggleTheme: () => {
    const current = get().theme;
    const next: ThemeMode = current === 'dark' ? 'light' : current === 'light' ? 'system' : 'dark';
    get().setTheme(next);
  },

  setLanguage: (lang) => {
    localStorage.setItem('offlinefm_lang', lang);
    i18n.changeLanguage(lang);
    set({ language: lang });
  },

  loadSettings: () => {
    const theme = (localStorage.getItem('offlinefm_theme') as ThemeMode) || 'system';
    const language = localStorage.getItem('offlinefm_lang') || 'en';
    set({ theme, language });
    applyTheme(theme);
    i18n.changeLanguage(language);
  },
}));

function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else if (theme === 'light') {
    root.classList.remove('dark');
  } else {
    // system
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
