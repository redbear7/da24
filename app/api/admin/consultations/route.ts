import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serviceType = searchParams.get("service"); // internet | clean | all
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const offset = (page - 1) * PAGE_SIZE;

  const results: unknown[] = [];
  let totalCount = 0;

  // 인터넷 상담 조회
  if (!serviceType || serviceType === "all" || serviceType === "internet") {
    let q = supabase
      .from("consultations")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });
    if (status) q = q.eq("status", status);
    if (serviceType === "internet" || !serviceType) {
      q = q.range(offset, offset + PAGE_SIZE - 1);
    }
    const { data, count } = await q;
    if (data) {
      results.push(
        ...data.map((r) => ({ ...r, _service: "internet" }))
      );
    }
    totalCount += count ?? 0;
  }

  // 청소 상담 조회
  if (!serviceType || serviceType === "all" || serviceType === "clean") {
    let q = supabase
      .from("clean_consultations")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });
    if (status) q = q.eq("status", status);
    if (serviceType === "clean") {
      q = q.range(offset, offset + PAGE_SIZE - 1);
    }
    const { data, count } = await q;
    if (data) {
      results.push(
        ...data.map((r) => ({ ...r, _service: "clean" }))
      );
    }
    totalCount += count ?? 0;
  }

  // "all" 인 경우 created_at 기준 정렬 후 페이지네이션
  if (!serviceType || serviceType === "all") {
    results.sort(
      (a: unknown, b: unknown) =>
        new Date((b as Record<string, string>).created_at).getTime() -
        new Date((a as Record<string, string>).created_at).getTime()
    );
    const paginated = results.slice(offset, offset + PAGE_SIZE);
    return NextResponse.json({ data: paginated, total: totalCount, page, pageSize: PAGE_SIZE });
  }

  return NextResponse.json({ data: results, total: totalCount, page, pageSize: PAGE_SIZE });
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, service, status } = await req.json();

    if (!id || !service || !status) {
      return NextResponse.json({ error: "id, service, status 필수" }, { status: 400 });
    }

    const table = service === "clean" ? "clean_consultations" : "consultations";
    const { error } = await supabase
      .from(table)
      .update({ status })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "업데이트 실패" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
