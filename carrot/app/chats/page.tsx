import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import EmptyState from "@/components/EmptyState";
import { formatRelativeTime } from "@/lib/utils";

export default async function ChatsListPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: rooms } = await supabase
    .from("chat_rooms")
    .select(
      "id, last_message_at, product:products(title), buyer:profiles!buyer_id(nickname), seller:profiles!seller_id(nickname)"
    )
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("last_message_at", { ascending: false, nullsFirst: false });

  return (
    <>
      <header className="sticky top-0 bg-white border-b border-border h-14 flex items-center px-4">
        <h1 className="font-bold text-[17px]">채팅</h1>
      </header>

      <main className="pb-24">
        {rooms && rooms.length > 0 ? (
          <ul>
            {rooms.map((r) => (
              <li key={r.id} className="border-b border-border-subtle">
                <Link
                  href={`/chats/${r.id}`}
                  className="flex gap-3 px-4 py-4"
                >
                  <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[15px] truncate">
                      {/* 상대 닉네임 표시 (간략화) */}
                      채팅방
                    </p>
                    <p className="text-[12px] text-text-muted">
                      {r.last_message_at
                        ? formatRelativeTime(r.last_message_at)
                        : "새 채팅"}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="아직 채팅이 없어요" />
        )}
      </main>
      <BottomNav />
    </>
  );
}
