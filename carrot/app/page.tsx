import Link from "next/link";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  // 현재 사용자 primary neighborhood 기반 최신 상품
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("nickname, primary_neighborhood_id")
        .eq("id", user.id)
        .single()
    : { data: null };

  const { data: neighborhood } = profile?.primary_neighborhood_id
    ? await supabase
        .from("neighborhoods")
        .select("dong, full_name")
        .eq("id", profile.primary_neighborhood_id)
        .single()
    : { data: null };

  const { data: products } = profile?.primary_neighborhood_id
    ? await supabase
        .from("products")
        .select("*")
        .eq("neighborhood_id", profile.primary_neighborhood_id)
        .eq("status", "selling")
        .order("created_at", { ascending: false })
        .limit(30)
    : { data: [] };

  return (
    <>
      <Header neighborhood={neighborhood?.dong ?? "동네 선택"} />
      <main className="pb-24">
        {products && products.length > 0 ? (
          <ul className="px-4">
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} neighborhoodName={neighborhood?.dong} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="아직 등록된 상품이 없어요"
            description="내 동네의 첫 번째 판매글을 올려보세요"
            action={
              <Link
                href="/products/new"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[14px] font-medium"
              >
                판매글 작성
              </Link>
            }
          />
        )}
      </main>

      <Link
        href="/products/new"
        aria-label="판매글 작성"
        className="fixed bottom-20 left-1/2 translate-x-[192px] w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
        style={{ maxWidth: "calc(50% + 256px)" }}
      >
        <Plus size={28} />
      </Link>

      <BottomNav />
    </>
  );
}
