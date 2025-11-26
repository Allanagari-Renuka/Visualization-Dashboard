// lib/theme-provider.js
import { createContext, useContext, useEffect, useState } from "react";

const ThemeProviderContext = createContext(undefined);

function getInitialTheme(storageKey, defaultTheme) {
  if (typeof window === "undefined") {
    return defaultTheme;
  }
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === "dark" || stored === "light") {
      return stored;
    }
  } catch {
    // localStorage not available
  }
  return defaultTheme;
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "dataviz-theme",
}) {
  const [theme, setTheme] = useState(() => getInitialTheme(storageKey, defaultTheme));

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        // localStorage not available
      }
      setTheme(newTheme);
    },
    toggleTheme: () => {
      const newTheme = theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        // localStorage not available
      }
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}