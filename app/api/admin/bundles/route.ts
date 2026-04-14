import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const packageType = searchParams.get("package_type");
  const status = searchParams.get("status"); // internet_status | moving_status | clean_status 필터용 서비스명
  const statusValue = searchParams.get("status_value"); // pending | matched | done
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const offset = (page - 1) * PAGE_SIZE;

  let q = supabase
    .from("bundle_consultations")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (packageType && packageType !== "all") {
    q = q.eq("package_type", packageType);
  }

  if (status && statusValue && statusValue !== "all") {
    const col = `${status}_status`;
    q = q.eq(col, statusValue);
  }

  q = q.range(offset, offset + PAGE_SIZE - 1);

  const { data, count, error } = await q;

  if (error) {
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }

  return NextResponse.json({
    data: data ?? [],
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, service, status } = await req.json();

    if (!id || !service || !status) {
      return NextResponse.json({ error: "id, service, status 필수" }, { status: 400 });
    }

    const validServices = ["internet", "moving", "clean"];
    const validStatuses = ["pending", "matched", "done"];

    if (!validServices.includes(service)) {
      return NextResponse.json({ error: "유효하지 않은 서비스" }, { status: 400 });
    }
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "유효하지 않은 상태" }, { status: 400 });
    }

    const col = `${service}_status`;
    const { error } = await supabase
      .from("bundle_consultations")
      .update({ [col]: status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "업데이트 실패" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
