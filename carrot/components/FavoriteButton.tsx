"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";

interface Props {
  productId: string;
  initialFavorited: boolean;
  initialCount: number;
}

export default function FavoriteButton({
  productId,
  initialFavorited,
  initialCount,
}: Props) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [count, setCount] = useState(initialCount);
  const [pending, startTransition] = useTransition();

  function toggle() {
    // 낙관적 업데이트
    const next = !favorited;
    setFavorited(next);
    setCount((c) => c + (next ? 1 : -1));

    startTransition(async () => {
      const res = next
        ? await fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product_id: productId }),
          })
        : await fetch(`/api/favorites?product_id=${productId}`, {
            method: "DELETE",
          });

      if (!res.ok) {
        // 롤백
        setFavorited(!next);
        setCount((c) => c + (next ? -1 : 1));
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-label={favorited ? "관심 해제" : "관심 등록"}
      className="flex items-center gap-1 text-[13px] text-text-muted"
    >
      <Heart
        size={20}
        fill={favorited ? "var(--color-danger)" : "none"}
        stroke={favorited ? "var(--color-danger)" : "currentColor"}
      />
      <span>{count}</span>
    </button>
  );
}
