"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "chronos-theme";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Inline script: Chronos is a light-only site — dark mode is never applied,
 * so public pages keep their ivory background with dark, readable text. */
export const themeInitScript = `(function(){try{localStorage.removeItem("${STORAGE_KEY}");}catch(_){}var e=document.documentElement;e.classList.remove("dark");e.style.colorScheme="light";})();`;

function applyTheme(_theme: Theme) {
  const el = document.documentElement;
  el.classList.remove("dark");
  el.style.colorScheme = "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    // Light-only site: clear any previously stored dark preference.
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setThemeState("light");
    applyTheme("light");
  }, []);

  const setTheme = useCallback((next: Theme) => {
    // Dark is not supported on the public site; always resolve to light.
    setThemeState("light");
    applyTheme("light");
    try {
      localStorage.setItem(STORAGE_KEY, next === "dark" ? "light" : next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme("light");
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
