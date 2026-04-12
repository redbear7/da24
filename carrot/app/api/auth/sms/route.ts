import { NextRequest, NextResponse } from "next/server";
import { SolapiMessageService } from "solapi";
import { saveCode } from "@/lib/sms-store";
import { isValidPhone, normalizePhone } from "@/lib/utils";

const messageService = new SolapiMessageService(
  process.env.SOLAPI_API_KEY!,
  process.env.SOLAPI_API_SECRET!
);

const FROM_NUMBER = process.env.SOLAPI_FROM_NUMBER!;

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: "올바른 휴대폰 번호를 입력해주세요." },
        { status: 400 }
      );
    }

    const clean = normalizePhone(phone);
    const code = String(Math.floor(100000 + Math.random() * 900000));
    saveCode(clean, code);

    await messageService.sendOne({
      to: clean,
      from: FROM_NUMBER,
      text: `[당근] 인증번호 [${code}]를 입력해주세요. (5분 이내)`,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("SMS send error:", e);
    return NextResponse.json(
      { error: "SMS 발송 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
