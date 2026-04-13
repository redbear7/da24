import { NextRequest, NextResponse } from "next/server";
import { SolapiMessageService } from "solapi";
import { saveCode } from "@/lib/sms-store";

const messageService = new SolapiMessageService(
  process.env.SOLAPI_API_KEY!,
  process.env.SOLAPI_API_SECRET!
);

const FROM_NUMBER = "01085757863";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "연락처를 입력해주세요." }, { status: 400 });
    }

    const phoneClean = phone.replace(/\D/g, "");
    if (phoneClean.length < 10 || phoneClean.length > 11) {
      return NextResponse.json({ error: "올바른 연락처를 입력해주세요." }, { status: 400 });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    saveCode(phoneClean, code);

    // WebOTP 호환 포맷: 마지막 줄에 @domain #code
    const origin = req.headers.get("origin") || "https://internet-nu.vercel.app";
    const domain = new URL(origin).hostname;

    await messageService.sendOne({
      to: phoneClean,
      from: FROM_NUMBER,
      text: `[다이사] 인증번호: ${code}\n\n@${domain} #${code}`,
    });

    return NextResponse.json({ success: true, message: "인증번호가 발송되었습니다." });
  } catch (e: unknown) {
    console.error("SMS send error:", e);
    return NextResponse.json({ error: "SMS 발송 중 오류가 발생했습니다." }, { status: 500 });
  }
}
