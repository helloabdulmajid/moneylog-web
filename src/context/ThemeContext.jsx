import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "theme";
const LIGHT = "light";
const DARK = "dark";
const SYSTEM = "system";

function getStoredTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === LIGHT || stored === DARK || stored === SYSTEM
    ? stored
    : LIGHT;
}

function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getStoredTheme);

  const applyTheme = (value) => {
    const isDark = value === DARK || (value === SYSTEM && systemPrefersDark());
    const root = document.documentElement;
    root.classList.toggle(DARK, isDark);
    root.style.colorScheme = isDark ? DARK : LIGHT;
  };

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);

    if (theme !== SYSTEM) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme(SYSTEM);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (value) => {
    if (value === LIGHT || value === DARK || value === SYSTEM) {
      setThemeState(value);
    }
  };

  const resolvedTheme =
    theme === SYSTEM ? (systemPrefersDark() ? DARK : LIGHT) : theme;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
