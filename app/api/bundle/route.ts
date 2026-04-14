import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SolapiMessageService } from "solapi";

const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const messageService = new SolapiMessageService(
  process.env.SOLAPI_API_KEY!,
  process.env.SOLAPI_API_SECRET!
);

const FROM_NUMBER = "01085757863";

const PACKAGE_LABELS: Record<string, string> = {
  basic: "베이직",
  allinone: "올인원",
  premium: "프리미엄",
};

// POST /api/bundle — 번들 상담 신청
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      packageType,
      fromAddress,
      toAddress,
      moveDate,
      size,
      memo,
    } = body;

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "이름과 연락처는 필수입니다." }, { status: 400 });
    }

    if (!packageType || !["basic", "allinone", "premium"].includes(packageType)) {
      return NextResponse.json({ error: "패키지 유형을 선택해주세요." }, { status: 400 });
    }

    const phoneClean = phone.replace(/\D/g, "");
    if (phoneClean.length < 10 || phoneClean.length > 11) {
      return NextResponse.json({ error: "올바른 연락처를 입력해주세요." }, { status: 400 });
    }

    const { data, error } = await supabaseAnon
      .from("bundle_consultations")
      .insert({
        name: name.trim(),
        phone: phoneClean,
        package_type: packageType,
        from_address: fromAddress?.trim() || null,
        to_address: toAddress?.trim() || null,
        move_date: moveDate || null,
        size: size?.trim() || null,
        memo: memo?.trim() || null,
      })
      .select()
      .single();

    if (error) {
      console.error("bundle insert error:", error);
      return NextResponse.json({ error: "상담 신청 중 오류가 발생했습니다." }, { status: 500 });
    }

    // 고객 확인 SMS
    try {
      const packageLabel = PACKAGE_LABELS[packageType] || packageType;
      await messageService.sendOne({
        to: phoneClean,
        from: FROM_NUMBER,
        text: `[다이사] ${name}님, ${packageLabel} 패키지 번들 상담 신청이 완료되었습니다.\n담당자가 빠른 시간 내 연락드리겠습니다.`,
      });
    } catch (smsErr) {
      console.error("customer SMS error:", smsErr);
      // SMS 실패해도 신청은 성공으로 처리
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (e) {
    console.error("bundle POST error:", e);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// GET /api/bundle — 어드민 번들 조회 (service_role)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const packageType = searchParams.get("package_type");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
  const offset = parseInt(searchParams.get("offset") || "0");

  let query = supabaseAdmin
    .from("bundle_consultations")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("status", status);
  if (packageType) query = query.eq("package_type", packageType);

  const { data, error } = await query;

  if (error) {
    console.error("bundle GET error:", error);
    return NextResponse.json({ error: "조회 중 오류가 발생했습니다." }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// POST /api/bundle?action=notify-vendor — 업체 배정 후 SMS 발송
// Body: { consultationId, vendorPhone, vendorName, serviceType, customerName, moveDate, address }
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      consultationId,
      vendorPhone,
      vendorName,
      serviceType,
      customerName,
      moveDate,
      address,
    } = body;

    if (!consultationId || !vendorPhone || !serviceType) {
      return NextResponse.json({ error: "필수 파라미터가 누락되었습니다." }, { status: 400 });
    }

    const SERVICE_LABELS: Record<string, string> = {
      moving: "이사",
      clean: "청소",
      internet: "인터넷",
      aircon: "에어컨",
    };

    const serviceLabel = SERVICE_LABELS[serviceType] || serviceType;
    const vendorPhoneClean = vendorPhone.replace(/\D/g, "");

    // 업체에 SMS 발송
    await messageService.sendOne({
      to: vendorPhoneClean,
      from: FROM_NUMBER,
      text: `[다이사 번들] ${vendorName}님, ${serviceLabel} 서비스 배정 안내\n고객: ${customerName}\n이사일: ${moveDate || "미정"}\n주소: ${address || "미정"}\n자세한 사항은 다이사 관리자에게 문의하세요.`,
    });

    // 서비스별 상태 업데이트
    const statusField = `${serviceType}_status`;
    const { error } = await supabaseAdmin
      .from("bundle_consultations")
      .update({ [statusField]: "matched" })
      .eq("id", consultationId);

    if (error) {
      console.error("bundle status update error:", error);
      return NextResponse.json({ error: "상태 업데이트 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("bundle PUT error:", e);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
