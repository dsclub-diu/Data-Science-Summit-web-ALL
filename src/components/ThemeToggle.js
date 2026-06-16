'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300/70 bg-white/70 text-slate-700 shadow-sm transition-all duration-300 hover:scale-105 hover:border-cyan-400 hover:text-cyan-600 dark:border-cyan-500/30 dark:bg-white/5 dark:text-cyan-300 dark:hover:border-cyan-400/70 dark:hover:text-cyan-200 ${className}`}
    >
      <Sun
        className={`h-5 w-5 transition-all duration-300 ${
          isDark ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        } absolute`}
      />
      <Moon
        className={`h-5 w-5 transition-all duration-300 ${
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'
        } absolute`}
      />
    </button>
  );
}
