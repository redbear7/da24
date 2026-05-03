"use client";

import Link from "next/link";
import { ClipboardList, MessageCircle, Sparkles } from "lucide-react";
import ColorModeToggle from "./ColorModeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-white/70 backdrop-blur-2xl">
      <div className="apple-container flex min-h-16 items-center justify-between gap-3 py-2">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background shadow-sm">
            <Sparkles className="h-4.5 w-4.5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[17px] font-semibold tracking-tight text-foreground">DA24</span>
            <span className="hidden text-[11px] font-medium text-text-muted sm:block">Home service concierge</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-[13px] font-medium text-text-secondary lg:flex">
          <Link href="/moving" className="hover:text-foreground">이사</Link>
          <Link href="/clean" className="hover:text-foreground">청소</Link>
          <Link href="/internet" className="hover:text-foreground">인터넷</Link>
          <Link href="/aircon" className="hover:text-foreground">에어컨</Link>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="hidden lg:block">
            <ColorModeToggle />
          </div>
          <Link href="/chat" className="apple-pill flex min-h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-foreground transition-colors hover:bg-white">
            <MessageCircle className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">채팅</span>
          </Link>
          <Link href="/history" className="flex min-h-10 items-center gap-1.5 rounded-full bg-foreground px-3.5 text-[13px] font-semibold text-background shadow-sm transition-transform active:scale-[0.98]">
            <ClipboardList className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">신청내역</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
