"use client";

import { useEffect, useState } from "react";

type ColorMode = "blue" | "red";

const MODES: { key: ColorMode; color: string }[] = [
  { key: "blue", color: "#0071E3" },
  { key: "red", color: "#FF3B30" },
];

export default function ColorModeToggle() {
  const [mode, setMode] = useState<ColorMode>(() => {
    if (typeof window === "undefined") return "blue";
    const saved = localStorage.getItem("color-mode") as ColorMode | null;
    return saved && MODES.some((m) => m.key === saved) ? saved : "blue";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-color-mode", mode);
  }, [mode]);

  const handleChange = (m: ColorMode) => {
    setMode(m);
    localStorage.setItem("color-mode", m);
    document.documentElement.setAttribute("data-color-mode", m);
  };

  return (
    <div className="apple-pill flex items-center gap-1 rounded-full p-1">
      {MODES.map(({ key, color }) => (
        <button
          key={key}
          onClick={() => handleChange(key)}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
            mode === key ? "bg-white shadow-sm" : "hover:bg-white/70"
          }`}
          aria-label={`${key} color mode`}
        >
          <span
            className="h-3.5 w-3.5 rounded-full"
            style={{ backgroundColor: color }}
          />
        </button>
      ))}
    </div>
  );
}
