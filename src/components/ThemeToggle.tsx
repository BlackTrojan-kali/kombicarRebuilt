// src/components/ThemeToggle.tsx
import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../features/theme/ThemeContext';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  // Fonction pour passer au thème suivant
  const toggleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-surface border border-border-main text-text-muted hover:text-kombi-orange-500 transition-colors shadow-sm focus:outline-none"
      title={`Thème actuel : ${theme}`}
    >
      {theme === 'light' && <Sun size={20} />}
      {theme === 'dark' && <Moon size={20} />}
      {theme === 'system' && <Monitor size={20} />}
    </button>
  );
};