import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const category = searchParams.get("category");
  const neighborhoodId = searchParams.get("neighborhood_id");

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, images:product_images(url, sort_order)")
    .eq("status", "selling")
    .order("created_at", { ascending: false })
    .limit(50);

  if (q) query = query.ilike("title", `%${q}%`);
  if (category) query = query.eq("category", category);
  if (neighborhoodId) query = query.eq("neighborhood_id", neighborhoodId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, price, category, image_urls } = body as {
    title: string;
    description: string;
    price: number;
    category: string;
    image_urls?: string[];
  };

  // 판매자의 주 동네 가져오기
  const { data: profile } = await supabase
    .from("profiles")
    .select("primary_neighborhood_id")
    .eq("id", user.id)
    .single();

  if (!profile?.primary_neighborhood_id) {
    return NextResponse.json(
      { error: "먼저 내 동네를 설정해주세요." },
      { status: 400 }
    );
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      seller_id: user.id,
      neighborhood_id: profile.primary_neighborhood_id,
      title,
      description,
      price,
      category,
    })
    .select()
    .single();

  if (error || !product) {
    return NextResponse.json(
      { error: error?.message ?? "등록 실패" },
      { status: 500 }
    );
  }

  // 이미지 insert
  if (image_urls && image_urls.length > 0) {
    const rows = image_urls.map((url, i) => ({
      product_id: product.id,
      url,
      sort_order: i,
    }));
    await supabase.from("product_images").insert(rows);
  }

  return NextResponse.json({ id: product.id });
}
