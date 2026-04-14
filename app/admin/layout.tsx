"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Building2, Star, Image, Menu, X, LogOut, Package } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/consultations", label: "상담 관리", icon: MessageSquare },
  { href: "/admin/bundles", label: "번들 상담", icon: Package },
  { href: "/admin/companies", label: "업체 관리", icon: Building2 },
  { href: "/admin/reviews", label: "리뷰 관리", icon: Star },
  { href: "/admin/banners", label: "배너 관리", icon: Image },
];

const AUTH_KEY = "da24_admin_auth";

function PinGate({ onAuth }: { onAuth: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const correct = process.env.NEXT_PUBLIC_ADMIN_PIN || "0000";
    if (pin === correct) {
      localStorage.setItem(AUTH_KEY, "1");
      onAuth();
    } else {
      setError("PIN이 올바르지 않습니다.");
      setPin("");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-sm shadow-sm">
        <div className="mb-6 text-center">
          <div className="text-[22px] font-bold text-foreground mb-1">다이사 어드민</div>
          <div className="text-[13px] text-muted-foreground">관리자 PIN을 입력하세요</div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            maxLength={10}
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(""); }}
            placeholder="PIN 번호"
            autoFocus
            className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-center text-[18px] tracking-widest"
          />
          {error && <p className="text-accent text-[13px] text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-[15px] hover:opacity-90 active:scale-[0.98] transition-transform"
          >
            확인
          </button>
        </form>
      </div>
    </div>
  );
}

function SidebarContent({ onClose, onLogout }: { onClose?: () => void; onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-card border-r border-border w-56">
      <div className="h-14 flex items-center justify-between px-5 border-b border-border shrink-0">
        <span className="text-[18px] font-bold text-primary">다이사 어드민</span>
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground md:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 overflow-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium mb-0.5 transition-colors",
                isActive
                  ? "bg-secondary text-primary"
                  : "text-text-secondary hover:bg-muted hover:text-foreground",
              ].join(" ")}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border shrink-0">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-[13px] font-medium text-text-secondary hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(AUTH_KEY) === "1") setAuthed(true);
    setChecked(true);
  }, []);

  function handleLogout() {
    localStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  }

  if (!checked) return null;
  if (!authed) return <PinGate onAuth={() => setAuthed(true)} />;

  const currentLabel = NAV_ITEMS.find((n) =>
    n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href)
  )?.label ?? "어드민";

  return (
    <div className="flex h-screen bg-muted overflow-hidden">
      {/* 데스크탑 사이드바 */}
      <div className="hidden md:flex shrink-0">
        <SidebarContent onLogout={handleLogout} />
      </div>

      {/* 모바일 드로어 */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative flex">
            <SidebarContent onClose={() => setMobileOpen(false)} onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* 콘텐츠 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-card border-b border-border flex items-center px-4 md:px-6 sticky top-0 z-10 shrink-0">
          <button
            className="mr-3 md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <p className="text-[14px] text-text-muted">{currentLabel}</p>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
