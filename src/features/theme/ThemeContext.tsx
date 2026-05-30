// src/features/theme/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState,type ReactNode } from 'react';

// Les trois options possibles
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // On lit le localStorage au démarrage, sinon on met 'system' par défaut
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('kombicar_theme') as Theme) || 'system'
  );

  useEffect(() => {
    const root = window.document.documentElement;

    // On retire toujours les anciennes classes pour éviter les conflits
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      // Si "system", on vérifie les préférences de l'OS
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      // Sinon, on applique le choix manuel
      root.classList.add(theme);
    }

    // On sauvegarde le choix de l'utilisateur
    localStorage.setItem('kombicar_theme', theme);
  }, [theme]);

  // Petit bonus : Écouter les changements du système en temps réel si l'option est sur "system"
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme doit être utilisé dans un ThemeProvider');
  }
  return context;
};