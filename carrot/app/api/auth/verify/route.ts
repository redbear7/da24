import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { verifyCode } from "@/lib/sms-store";
import { normalizePhone } from "@/lib/utils";
import { defaultNickname, phoneToEmail, phoneToPassword } from "@/lib/auth";

// 관리자 권한 클라이언트 (서비스 롤) — 서버 전용
function adminClient() {
  return createAdminClient(
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

    const email = phoneToEmail(clean);
    const password = phoneToPassword(clean);

    // 1) 프로필 존재 여부로 신규/기존 판정
    const admin = adminClient();
    const { data: existingProfile } = await admin
      .from("profiles")
      .select("id")
      .eq("phone", clean)
      .maybeSingle();

    const isNew = !existingProfile;

    // 2) auth.users에 계정이 없으면 생성 (가상 이메일 + 결정적 비밀번호)
    if (isNew) {
      const { error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { phone: clean },
      });
      // 이미 존재(race)하면 무시
      if (createErr && !String(createErr.message).includes("already")) {
        console.error("createUser error:", createErr);
        return NextResponse.json(
          { error: "계정 생성 중 오류가 발생했습니다." },
          { status: 500 }
        );
      }
    }

    // 3) 서버 SSR 클라이언트로 signIn → 쿠키에 세션 기록
    const supabase = await createServerClient();
    const { data: signIn, error: signErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signErr || !signIn.user) {
      console.error("signIn error:", signErr);
      return NextResponse.json(
        { error: "로그인 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // 4) 신규 사용자: 프로필 행 생성 (기본 닉네임)
    if (isNew) {
      await admin.from("profiles").insert({
        id: signIn.user.id,
        phone: clean,
        nickname: defaultNickname(clean),
      });
    }

    return NextResponse.json({ success: true, isNew });
  } catch (e) {
    console.error("verify error:", e);
    return NextResponse.json(
      { error: "인증 확인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
