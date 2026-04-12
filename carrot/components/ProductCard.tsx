import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, formatRelativeTime } from "@/lib/utils";

interface Props {
  product: Product;
  neighborhoodName?: string;
  thumbnailUrl?: string;
}

export default function ProductCard({
  product,
  neighborhoodName,
  thumbnailUrl,
}: Props) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="flex gap-3 py-4 border-b border-border-subtle"
    >
      <div className="w-[100px] h-[100px] rounded-lg bg-muted overflow-hidden flex-shrink-0">
        {thumbnailUrl ? (
          // 의도적으로 img 사용 (동적 Supabase Storage URL)
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-medium line-clamp-2">{product.title}</h3>
        <p className="text-[12px] text-text-muted mt-0.5">
          {neighborhoodName ?? ""} · {formatRelativeTime(product.created_at)}
        </p>
        <p className="text-[15px] font-bold mt-1">{formatPrice(product.price)}</p>
        <div className="flex items-center gap-2 mt-1 text-[12px] text-text-muted">
          {product.chat_count > 0 && (
            <span className="flex items-center gap-0.5">
              <MessageCircle size={12} /> {product.chat_count}
            </span>
          )}
          {product.favorite_count > 0 && (
            <span className="flex items-center gap-0.5">
              <Heart size={12} /> {product.favorite_count}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
