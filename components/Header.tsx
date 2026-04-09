"use client";

import Image from "next/image";
import { ClipboardList } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border-main">
      <div className="max-w-[480px] mx-auto flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <div className="flex items-center gap-1.5">
          <Image
            src="/images/logo-da24.svg"
            alt="다이사"
            width={72}
            height={28}
            unoptimized
            priority
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary bg-secondary rounded-full hover:bg-blue-100 transition-colors">
            <ClipboardList className="w-3.5 h-3.5" />
            내 신청내역
          </button>
        </div>
      </div>
    </header>
  );
}
