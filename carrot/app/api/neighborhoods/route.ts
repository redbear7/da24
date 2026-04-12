import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/neighborhoods?q=역삼
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("neighborhoods")
    .select("*")
    .or(`dong.ilike.%${q}%,full_name.ilike.%${q}%`)
    .limit(30);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST /api/neighborhoods  { neighborhood_id, is_primary }
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { neighborhood_id, is_primary } = await req.json();
  if (!neighborhood_id) {
    return NextResponse.json(
      { error: "neighborhood_id가 필요합니다." },
      { status: 400 }
    );
  }

  // 동네 연결 (최대 2개 제약은 트리거/애플리케이션 레벨에서 검증)
  const { error } = await supabase.from("user_neighborhoods").upsert({
    user_id: user.id,
    neighborhood_id,
    is_primary: !!is_primary,
    verified_at: new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (is_primary) {
    await supabase
      .from("profiles")
      .update({ primary_neighborhood_id: neighborhood_id })
      .eq("id", user.id);
  }

  return NextResponse.json({ success: true });
}
