import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeProviderContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined);

function getInitialTheme(storageKey: string, defaultTheme: Theme): Theme {
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
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme(storageKey, defaultTheme));

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
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
