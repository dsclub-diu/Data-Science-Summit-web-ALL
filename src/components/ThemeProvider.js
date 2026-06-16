'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  // Sync with whatever the anti-flash script already applied
  useEffect(() => {
    const current =
      document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current);
  }, []);

  const applyTheme = (next) => {
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('dss-theme', next);
    } catch {
      /* ignore */
    }
    setTheme(next);
  };

  const toggleTheme = () => applyTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
