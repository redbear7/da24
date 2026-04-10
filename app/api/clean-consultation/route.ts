import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, cleanType, size, room, date, address, memo } = body;

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "이름과 연락처는 필수입니다." }, { status: 400 });
    }

    const phoneClean = phone.replace(/\D/g, "");
    if (phoneClean.length < 10 || phoneClean.length > 11) {
      return NextResponse.json({ error: "올바른 연락처를 입력해주세요." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("clean_consultations")
      .insert({
        name: name.trim(),
        phone: phoneClean,
        clean_type: cleanType || "movein",
        size: size || null,
        room: room || null,
        preferred_date: date || null,
        address: address?.trim() || null,
        memo: memo?.trim() || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "상담 신청 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (e) {
    console.error("Clean consultation API error:", e);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
