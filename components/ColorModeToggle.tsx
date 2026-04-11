"use client";

import { useEffect, useState } from "react";

type ColorMode = "blue" | "red";

const MODES: { key: ColorMode; color: string }[] = [
  { key: "blue", color: "#2640E6" },
  { key: "red", color: "#EA2804" },
];

export default function ColorModeToggle() {
  const [mode, setMode] = useState<ColorMode>("blue");

  useEffect(() => {
    const saved = localStorage.getItem("color-mode") as ColorMode | null;
    if (saved && MODES.some((m) => m.key === saved)) {
      setMode(saved);
    }
    document.documentElement.setAttribute("data-color-mode", saved || "blue");
  }, []);

  const handleChange = (m: ColorMode) => {
    setMode(m);
    localStorage.setItem("color-mode", m);
    document.documentElement.setAttribute("data-color-mode", m);
  };

  return (
    <div className="flex items-center bg-muted rounded-full p-1 gap-1">
      {MODES.map(({ key, color }) => (
        <button
          key={key}
          onClick={() => handleChange(key)}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            mode === key ? "bg-white shadow-sm scale-110" : "hover:scale-105"
          }`}
        >
          <span
            className="w-3.5 h-3.5 rounded-full"
            style={{ backgroundColor: color }}
          />
        </button>
      ))}
    </div>
  );
}
