"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/70 bg-white/90 text-slate-700 shadow-soft hover:border-brand-500/70 hover:text-brand-600 hover:bg-white dark:border-slate-700/70 dark:bg-slate-900/80 dark:text-slate-200 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <SunIcon className="h-4 w-4" />
      ) : (
        <MoonIcon className="h-4 w-4" />
      )}
    </button>
  );
}
