"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ClipboardList } from "lucide-react";
import ColorModeToggle from "./ColorModeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-[640px] mx-auto flex items-center justify-between px-5 h-16">
        <Link href="/">
          <Image
            src="/images/logo-da24.png"
            alt="다이사"
            width={86}
            height={30}
            unoptimized
            priority
          />
        </Link>

        <div className="flex items-center gap-2">
          <ColorModeToggle />
          <Link href="/chat" className="flex items-center gap-1.5 px-3.5 py-2 text-[14px] font-medium text-primary border border-primary/30 rounded-full hover:bg-secondary transition-colors">
            <MessageCircle className="w-3.5 h-3.5" />
            채팅내역
          </Link>
          <Link href="/history" className="flex items-center gap-1.5 px-3.5 py-2 text-[14px] font-medium text-primary border border-primary/30 rounded-full hover:bg-secondary transition-colors">
            <ClipboardList className="w-3.5 h-3.5" />
            내 신청내역
          </Link>
        </div>
      </div>
    </header>
  );
}
