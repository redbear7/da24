import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";

export default async function FavoritesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: rows } = await supabase
    .from("favorites")
    .select("product:products(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const products = (rows ?? [])
    .map((r) => r.product)
    .flat()
    .filter(Boolean);

  return (
    <>
      <header className="sticky top-0 bg-white border-b border-border h-14 flex items-center px-4">
        <h1 className="font-bold text-[17px]">관심목록</h1>
      </header>
      <main className="pb-24">
        {products.length > 0 ? (
          <ul className="px-4">
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="관심 상품이 없어요" />
        )}
      </main>
      <BottomNav />
    </>
  );
}
