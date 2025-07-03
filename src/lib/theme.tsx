<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> e25df71 (admin dashboard)
=======
>>>>>>> 923fc14 (client (profile,dashboard))
// Remove all theme context, provider, and logic. Default to light mode.
// ... existing code ... 
=======
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );
  const [loading, setLoading] = useState(true);

  // Fetch user theme from DB on mount
  useEffect(() => {
    const fetchTheme = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('theme')
          .eq('id', user.id)
<<<<<<< HEAD
<<<<<<< HEAD
          .maybeSingle();
=======
          .single();
>>>>>>> e25df71 (admin dashboard)
=======
          .maybeSingle();
>>>>>>> 9b83c4a (Refactor database queries to use maybeSingle() for safer data retrieval)
        if (profile && profile.theme) {
          setThemeState(profile.theme);
          localStorage.setItem('theme', profile.theme);
        }
      }
      setLoading(false);
    };
    fetchTheme();
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Update theme in DB and state
  const setTheme = async (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({ theme: newTheme }).eq('id', user.id);
    }
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}; 
<<<<<<< HEAD
>>>>>>> 7438431 (admin dashboard)
=======
// Remove all theme context, provider, and logic. Default to light mode.
// ... existing code ... 
>>>>>>> b2a4ea7 (client (profile,dashboard))
=======
>>>>>>> 089fd42 (admin dashboard)
<<<<<<< HEAD
>>>>>>> e25df71 (admin dashboard)
=======
=======
// Remove all theme context, provider, and logic. Default to light mode.
// ... existing code ... 
>>>>>>> c427d0d (client (profile,dashboard))
>>>>>>> 923fc14 (client (profile,dashboard))
