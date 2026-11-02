"use client";

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import styles from "./Header.module.scss";

type Mode = "light" | "dark";
const STORAGE_KEY = "abdul-portfolio-theme";

function applyTheme(mode: Mode) {
  document.documentElement.dataset.theme = mode;
  document.documentElement.style.colorScheme = mode;
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    const current: Mode = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setMode(current);
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        const next: Mode = event.newValue === "dark" ? "dark" : "light";
        applyTheme(next);
        setMode(next);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function toggle() {
    const next: Mode = mode === "light" ? "dark" : "light";
    applyTheme(next);
    setMode(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* Storage may be restricted. */ }
  }

  const isDark = mode === "dark";
  const label = isDark ? "Switch to day mode" : "Switch to night mode";

  return (
    <button
      type="button"
      className={styles.themeToggle}
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
    >
      {isDark ? <FiSun aria-hidden="true" size={18} /> : <FiMoon aria-hidden="true" size={18} />}
      <span className={styles.themeLabel}>{isDark ? "Day" : "Night"}</span>
    </button>
  );
}
