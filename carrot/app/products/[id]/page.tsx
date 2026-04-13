import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ImageGallery from "@/components/ImageGallery";
import FavoriteButton from "@/components/FavoriteButton";
import { formatPrice, formatRelativeTime } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      "*, seller:profiles!seller_id(id, nickname, avatar_url, manner_temp), images:product_images(url, sort_order), neighborhood:neighborhoods(dong, full_name)"
    )
    .eq("id", id)
    .single();

  if (!product) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = user?.id === product.seller_id;

  // 관심 여부
  let favorited = false;
  if (user) {
    const { data: fav } = await supabase
      .from("favorites")
      .select("user_id")
      .eq("user_id", user.id)
      .eq("product_id", id)
      .maybeSingle();
    favorited = !!fav;
  }

  return (
    <main className="pb-24">
      {/* 이미지 갤러리 */}
      <ImageGallery images={product.images ?? []} alt={product.title} />

      {/* 판매자 */}
      <section className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-muted" />
        <div className="flex-1">
          <p className="font-medium text-[15px]">{product.seller?.nickname}</p>
          <p className="text-[12px] text-text-muted">
            {product.neighborhood?.dong}
          </p>
        </div>
        <span className="text-[13px] text-primary font-bold">
          {product.seller?.manner_temp}°C
        </span>
      </section>

      {/* 상품 본문 */}
      <section className="px-4 py-5">
        <h1 className="text-[20px] font-bold">{product.title}</h1>
        <p className="text-[12px] text-text-muted mt-1">
          {product.category} · {formatRelativeTime(product.created_at)}
        </p>
        <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed">
          {product.description}
        </p>
        <p className="mt-4 text-[12px] text-text-muted">
          관심 {product.favorite_count} · 채팅 {product.chat_count} · 조회 {product.view_count}
        </p>
      </section>

      {/* 하단 가격/채팅 바 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[640px] bg-white border-t border-border">
        <div className="flex items-center gap-3 px-4 h-16 safe-bottom">
          {!isOwner && user && (
            <FavoriteButton
              productId={product.id}
              initialFavorited={favorited}
              initialCount={product.favorite_count}
            />
          )}
          <p className="flex-1 text-[17px] font-bold">
            {formatPrice(product.price)}
          </p>
          {isOwner ? (
            <Link
              href={`/products/${product.id}/edit`}
              className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium"
            >
              게시글 수정
            </Link>
          ) : (
            <form action={`/api/chats`} method="post">
              <input type="hidden" name="product_id" value={product.id} />
              <button
                type="submit"
                className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium"
              >
                채팅하기
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
