// 인증번호 임시 저장소 (프로덕션에서는 Redis/Supabase 사용)
const store = new Map<string, { code: string; expires: number }>();

export function saveCode(phone: string, code: string) {
  store.set(phone, { code, expires: Date.now() + 5 * 60 * 1000 });
}

export function verifyCode(phone: string, code: string): boolean {
  const entry = store.get(phone);
  if (!entry) return false;
  if (Date.now() > entry.expires) {
    store.delete(phone);
    return false;
  }
  if (entry.code !== code) return false;
  store.delete(phone);
  return true;
}
