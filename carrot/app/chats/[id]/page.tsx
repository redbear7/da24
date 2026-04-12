"use client";

import { use, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ChatMessage } from "@/lib/types";

export default function ChatRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: roomId } = use(params);
  const supabase = createClient();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      setUserId(user?.id ?? null);

      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });
      if (!cancelled) setMessages((data as ChatMessage[]) ?? []);
    }

    load();

    // Realtime 구독
    const channel = supabase
      .channel(`chat:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const content = input.trim();
    if (!content || !userId) return;

    setInput("");
    await supabase.from("chat_messages").insert({
      room_id: roomId,
      sender_id: userId,
      content,
    });
  }

  return (
    <main className="min-h-dvh flex flex-col">
      <header className="sticky top-0 bg-white border-b border-border h-14 flex items-center px-4">
        <h1 className="font-bold text-[16px]">채팅</h1>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
        <ul className="flex flex-col gap-2">
          {messages.map((m) => {
            const mine = m.sender_id === userId;
            return (
              <li
                key={m.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-[14px] ${
                    mine
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {m.content}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <form
        onSubmit={handleSend}
        className="sticky bottom-0 bg-white border-t border-border px-3 py-2 safe-bottom flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지 보내기"
          className="flex-1 h-10 px-3 bg-muted rounded-full text-[15px] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40"
          aria-label="보내기"
        >
          <Send size={18} />
        </button>
      </form>
    </main>
  );
}
