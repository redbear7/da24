"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Neighborhood } from "@/lib/types";

export default function NeighborhoodPage() {
  const router = useRouter();
  const params = useSearchParams();
  const isOnboarding = params.get("onboarding") === "1";

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(q: string) {
    setQuery(q);
    if (q.trim().length < 1) {
      setResults([]);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("neighborhoods")
      .select("*")
      .or(`dong.ilike.%${q}%,full_name.ilike.%${q}%`)
      .limit(30);
    setResults((data as Neighborhood[]) ?? []);
    setLoading(false);
  }

  async function handleSelect(n: Neighborhood) {
    const res = await fetch("/api/neighborhoods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ neighborhood_id: n.id, is_primary: true }),
    });
    if (res.ok) router.push("/");
  }

  return (
    <main className="min-h-dvh flex flex-col">
      <header className="sticky top-0 bg-white border-b border-border px-4 h-14 flex items-center">
        <h1 className="font-bold text-[17px]">
          {isOnboarding ? "내 동네 설정" : "동네 검색"}
        </h1>
      </header>

      <div className="px-4 py-3">
        <div className="flex items-center gap-2 h-11 px-3 bg-muted rounded-lg">
          <Search size={18} className="text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="동명으로 검색 (예: 역삼동)"
            className="flex-1 bg-transparent text-[15px] focus:outline-none"
            autoFocus
          />
        </div>
      </div>

      <ul className="flex-1">
        {loading && (
          <li className="px-4 py-4 text-[13px] text-text-muted">검색 중...</li>
        )}
        {!loading &&
          results.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => handleSelect(n)}
                className="w-full flex items-center gap-2 px-4 py-4 border-b border-border-subtle text-left"
              >
                <MapPin size={16} className="text-text-muted" />
                <span className="text-[15px]">{n.fullName}</span>
              </button>
            </li>
          ))}
      </ul>
    </main>
  );
}
