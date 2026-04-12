"use client";

import Link from "next/link";
import { ChevronDown, Search, Bell } from "lucide-react";

interface Props {
  neighborhood?: string;
  showSearch?: boolean;
}

export default function Header({ neighborhood = "동네 선택", showSearch = true }: Props) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        <Link
          href="/neighborhood"
          className="flex items-center gap-1 font-bold text-[17px]"
        >
          {neighborhood}
          <ChevronDown size={18} />
        </Link>
        {showSearch && (
          <div className="flex items-center gap-3 text-foreground">
            <Link href="/products?q=" aria-label="검색">
              <Search size={22} />
            </Link>
            <Link href="/notifications" aria-label="알림">
              <Bell size={22} />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
