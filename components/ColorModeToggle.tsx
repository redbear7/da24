"use client";

import { useEffect, useState } from "react";

type ColorMode = "blue" | "airbnb" | "replicate";

const MODES: { key: ColorMode; label: string; color: string }[] = [
  { key: "blue", label: "블루", color: "#2640E6" },
  { key: "airbnb", label: "Airbnb", color: "#FF385C" },
  { key: "replicate", label: "Replicate", color: "#EA2804" },
];

export default function ColorModeToggle() {
  const [mode, setMode] = useState<ColorMode>("blue");

  useEffect(() => {
    const saved = localStorage.getItem("color-mode") as ColorMode | null;
    if (saved && MODES.some((m) => m.key === saved)) {
      setMode(saved);
    }
    // 항상 attribute 설정 (기본값 blue 포함)
    document.documentElement.setAttribute("data-color-mode", saved || "blue");
  }, []);

  const handleChange = (m: ColorMode) => {
    setMode(m);
    localStorage.setItem("color-mode", m);
    document.documentElement.setAttribute("data-color-mode", m);
  };

  return (
    <div className="flex items-center bg-muted rounded-full p-0.5 gap-0.5">
      {MODES.map(({ key, label, color }) => (
        <button
          key={key}
          onClick={() => handleChange(key)}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold transition-all ${
            mode === key
              ? "bg-white shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          {label}
        </button>
      ))}
    </div>
  );
}
