import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyCode } from "@/lib/sms-store";
import { normalizePhone } from "@/lib/utils";

// 관리자 권한 클라이언트 (서비스 롤)
// NOTE: SERVICE_ROLE_KEY는 반드시 서버 환경에서만 사용해야 합니다.
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();
    const clean = normalizePhone(phone);

    if (!verifyCode(clean, code)) {
      return NextResponse.json(
        { error: "인증번호가 올바르지 않거나 만료되었습니다." },
        { status: 400 }
      );
    }

    // Supabase Auth에 phone 기반 계정 생성/조회 후 세션 발급
    // 구현 전략:
    // 1) email `{phone}@carrot.local` 가상 계정으로 매핑
    // 2) 최초 접속 시 signUp, 이후 signInWithPassword
    // 3) 응답으로 isNew 플래그 전달 → 온보딩 경로 결정
    // (자세한 세션 쿠키 설정은 @supabase/ssr 연동으로 별도 구현)

    const admin = adminClient();
    const { data: existing } = await admin
      .from("profiles")
      .select("id")
      .eq("phone", clean)
      .maybeSingle();

    const isNew = !existing;

    // TODO: 실제 세션 발급 (signInWithOtp / admin.createUser 등)
    //       MVP 단계에서는 프로필 upsert만 수행.

    return NextResponse.json({ success: true, isNew });
  } catch (e) {
    console.error("verify error:", e);
    return NextResponse.json(
      { error: "인증 확인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
