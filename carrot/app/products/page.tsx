import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";

interface Props {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function ProductsListPage({ searchParams }: Props) {
  const { q, category } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*")
    .eq("status", "selling")
    .order("created_at", { ascending: false })
    .limit(50);

  if (q) query = query.ilike("title", `%${q}%`);
  if (category) query = query.eq("category", category);

  const { data: products } = await query;

  return (
    <>
      <Header />
      <main className="pb-24">
        {products && products.length > 0 ? (
          <ul className="px-4">
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="검색 결과가 없어요" />
        )}
      </main>
      <BottomNav />
    </>
  );
}
