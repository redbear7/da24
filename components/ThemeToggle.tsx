"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />;

  const modes = [
    { key: "light", icon: Sun, label: "라이트" },
    { key: "dark", icon: Moon, label: "다크" },
    { key: "system", icon: Monitor, label: "시스템" },
  ] as const;

  return (
    <div className="flex items-center bg-muted rounded-full p-0.5 gap-0.5">
      {modes.map(({ key, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={`p-1.5 rounded-full transition-colors ${
            theme === key
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  );
}
