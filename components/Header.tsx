"use client";

import Image from "next/image";
import { MessageCircle, ClipboardList } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-[640px] mx-auto flex items-center justify-between px-5 h-16">
        {/* Logo */}
        <Image
          src="/images/logo-da24.svg"
          alt="다이사"
          width={80}
          height={32}
          unoptimized
          priority
          className="dark:invert"
        />

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-primary border border-primary/30 rounded-full hover:bg-secondary transition-colors">
            <MessageCircle className="w-3.5 h-3.5" />
            채팅내역
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-primary border border-primary/30 rounded-full hover:bg-secondary transition-colors">
            <ClipboardList className="w-3.5 h-3.5" />
            내 신청내역
          </button>
        </div>
      </div>
    </header>
  );
}
