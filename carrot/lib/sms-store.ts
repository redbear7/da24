// 인증번호 임시 저장소
// NOTE: 프로세스 메모리 저장이므로 서버리스/멀티 인스턴스 환경에서는
// Redis 또는 Supabase 테이블로 대체해야 합니다.

interface Entry {
  code: string;
  expires: number;
  attempts: number;
}

const store = new Map<string, Entry>();
const MAX_ATTEMPTS = 5;
const EXPIRES_MS = 5 * 60 * 1000;

export function saveCode(phone: string, code: string) {
  store.set(phone, {
    code,
    expires: Date.now() + EXPIRES_MS,
    attempts: 0,
  });
}

export function verifyCode(phone: string, code: string): boolean {
  const entry = store.get(phone);
  if (!entry) return false;

  if (Date.now() > entry.expires) {
    store.delete(phone);
    return false;
  }

  entry.attempts += 1;
  if (entry.attempts > MAX_ATTEMPTS) {
    store.delete(phone);
    return false;
  }

  if (entry.code !== code) return false;

  store.delete(phone);
  return true;
}
