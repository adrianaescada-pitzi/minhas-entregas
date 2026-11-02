"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { MoonIcon, SearchIcon, SunIcon } from "./icons";
import { useTheme, type Theme } from "./theme";

interface Props {
  query: string;
  onQueryChange: (value: string) => void;
}

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
];

const noopSubscribe = () => () => {};
const isApple = () => /Mac|iPhone|iPad/.test(navigator.platform);

/** Busca (filtra as tarefas de hoje) e seletor de tema. */
export function TopBar({ query, onQueryChange }: Props) {
  const [theme, setTheme] = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  // "Ctrl K" no servidor e em Windows/Linux; "⌘ K" no Mac (sem divergir na hidratação)
  const shortcut = useSyncExternalStore(noopSubscribe, () => (isApple() ? "⌘ K" : "Ctrl K"), () => "Ctrl K");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex h-12 min-w-0 flex-[1_1_320px] items-center gap-2.5 rounded-full border border-border bg-nav pr-2 pl-[18px] text-muted shadow-soft">
        <SearchIcon size={18} />
        <input
          ref={inputRef}
          type="search"
          aria-label="Buscar tarefas de hoje por nome ou projeto"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar tarefas ou projetos…"
          className="h-11 min-w-0 flex-1 border-0 bg-transparent text-sm text-ink outline-offset-4 placeholder:text-muted"
        />
        <span
          aria-hidden="true"
          className="hidden rounded-[10px] bg-subtle px-2.5 py-1 text-xs font-semibold text-ink-2 sm:inline"
        >
          {shortcut}
        </span>
      </div>

      <div
        role="group"
        aria-label="Tema da interface"
        className="inline-flex gap-1 rounded-full border border-border bg-nav p-1 shadow-soft"
      >
        {THEME_OPTIONS.map(({ value, label }) => {
          const on = theme === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={on}
              onClick={() => setTheme(value)}
              className={`inline-flex min-h-10 items-center gap-2 rounded-full border-0 px-4 text-[13px] font-bold ${
                on ? "bg-action text-white" : "bg-transparent text-ink-2"
              }`}
            >
              {value === "light" ? <SunIcon /> : <MoonIcon />}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
