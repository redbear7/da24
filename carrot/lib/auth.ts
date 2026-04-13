import { createHmac } from "node:crypto";

/**
 * 휴대폰 번호 → Supabase Auth 가상 이메일 매핑 전략
 *
 * 당근 클론은 Solapi로 SMS 인증번호를 직접 발송하므로,
 * Supabase Auth의 phone 로그인(Twilio 필수)을 쓰지 않는다.
 * 대신 `{phone}@carrot.local` 가상 이메일 + 결정적 비밀번호로
 * admin이 유저를 findOrCreate → 서버 클라이언트가 signInWithPassword
 * 로 세션 쿠키를 발급하는 방식을 사용한다.
 */

const EMAIL_DOMAIN = "carrot.local";

export function phoneToEmail(phone: string): string {
  return `${phone}@${EMAIL_DOMAIN}`;
}

export function phoneToPassword(phone: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET 환경변수가 필요합니다.");
  }
  return createHmac("sha256", secret).update(phone).digest("hex");
}

/**
 * 휴대폰 뒷 4자리를 닉네임 기본값으로 사용.
 * 예: 01012345678 → 당근5678
 */
export function defaultNickname(phone: string): string {
  const suffix = phone.slice(-4);
  return `당근${suffix}`;
}
