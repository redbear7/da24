import { NextRequest, NextResponse } from "next/server";
import { verifyCode } from "@/lib/sms-store";

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json({ error: "연락처와 인증번호를 입력해주세요." }, { status: 400 });
    }

    const phoneClean = phone.replace(/\D/g, "");
    const isValid = verifyCode(phoneClean, code);

    if (!isValid) {
      return NextResponse.json({ error: "인증번호가 올바르지 않거나 만료되었습니다." }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "인증이 완료되었습니다." });
  } catch {
    return NextResponse.json({ error: "인증 확인 중 오류가 발생했습니다." }, { status: 500 });
  }
}
