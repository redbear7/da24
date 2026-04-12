import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 상품 상세에서 "채팅하기" 버튼 → 기존 방 있으면 재사용, 없으면 생성
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  // form-data 또는 json 모두 수용
  let productId: string | null = null;
  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    productId = body.product_id;
  } else {
    const form = await req.formData();
    productId = form.get("product_id")?.toString() ?? null;
  }

  if (!productId) {
    return NextResponse.json({ error: "product_id가 필요합니다." }, { status: 400 });
  }

  const { data: product } = await supabase
    .from("products")
    .select("id, seller_id")
    .eq("id", productId)
    .single();
  if (!product) {
    return NextResponse.json({ error: "상품을 찾을 수 없습니다." }, { status: 404 });
  }
  if (product.seller_id === user.id) {
    return NextResponse.json(
      { error: "본인 상품에는 채팅방을 만들 수 없습니다." },
      { status: 400 }
    );
  }

  // 기존 방 조회
  const { data: existing } = await supabase
    .from("chat_rooms")
    .select("id")
    .eq("product_id", productId)
    .eq("buyer_id", user.id)
    .maybeSingle();

  let roomId = existing?.id;
  if (!roomId) {
    const { data: room, error } = await supabase
      .from("chat_rooms")
      .insert({
        product_id: productId,
        buyer_id: user.id,
        seller_id: product.seller_id,
      })
      .select("id")
      .single();
    if (error || !room) {
      return NextResponse.json(
        { error: error?.message ?? "방 생성 실패" },
        { status: 500 }
      );
    }
    roomId = room.id;
  }

  // 302 redirect for form post
  if (!contentType.includes("application/json")) {
    return NextResponse.redirect(new URL(`/chats/${roomId}`, req.url), 303);
  }

  return NextResponse.json({ id: roomId });
}
