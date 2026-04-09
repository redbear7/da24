"use client";

import { Hexagon, FileText, ClipboardList } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border-main">
      <div className="max-w-[480px] mx-auto flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Hexagon className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-text-primary">다이사</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-text-secondary bg-surface rounded-full hover:bg-border-subtle transition-colors">
            <FileText className="w-3.5 h-3.5" />
            재정보험
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary bg-secondary rounded-full hover:bg-blue-100 transition-colors">
            <ClipboardList className="w-3.5 h-3.5" />
            내 신청내역
          </button>
        </div>
      </div>
    </header>
  );
}
