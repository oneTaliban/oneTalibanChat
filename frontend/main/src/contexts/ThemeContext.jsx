import React, {createContext, useContext, useState, useEffect} from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // check system preference or saved theme
    const savedTheme  = localStorage.getItem('one-taliban-theme');
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
      
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(systemPrefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('one-taliban-theme', newTheme ? 'dark' : 'light');
  };

  const value = {
    isDark, 
    toggleTheme,
    theme: isDark ? 'dark' : 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={isDark ? 'dark' : 'light'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};


export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be within a ThemeProvider");
  }
  return context;
};