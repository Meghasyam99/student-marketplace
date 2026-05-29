/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "cm_theme";

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "dark" || saved === "light" ? saved : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", mode);
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === "dark",
      toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")),
      setMode,
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
