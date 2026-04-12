import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("*").eq("id", user.id).single()
    : { data: null };

  return (
    <>
      <header className="sticky top-0 bg-white border-b border-border h-14 flex items-center px-4">
        <h1 className="font-bold text-[17px]">나의 당근</h1>
      </header>
      <main className="pb-24 px-4 py-6">
        <section className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted" />
          <div>
            <p className="font-bold text-[17px]">{profile?.nickname ?? "-"}</p>
            <p className="text-[12px] text-text-muted">
              매너 온도 {profile?.manner_temp ?? 36.5}°C
            </p>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
