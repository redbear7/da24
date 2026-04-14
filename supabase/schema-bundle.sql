-- ============================================
-- 번들 패키지 상담 테이블
-- ============================================

CREATE TABLE IF NOT EXISTS bundle_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  package_type TEXT NOT NULL CHECK (package_type IN ('basic', 'allinone', 'premium')),

  -- 이사 정보
  from_address TEXT,
  to_address TEXT,
  move_date DATE,
  size TEXT,

  -- 서비스별 배정 상태
  moving_status TEXT NOT NULL DEFAULT 'pending' CHECK (moving_status IN ('pending', 'matched', 'done')),
  clean_status TEXT NOT NULL DEFAULT 'pending' CHECK (clean_status IN ('pending', 'matched', 'done')),
  internet_status TEXT NOT NULL DEFAULT 'pending' CHECK (internet_status IN ('pending', 'matched', 'done')),
  aircon_status TEXT NOT NULL DEFAULT 'pending' CHECK (aircon_status IN ('pending', 'matched', 'done')),

  -- 할인 및 메모
  total_discount INT DEFAULT 0,
  memo TEXT,

  -- 전체 상태
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),

  created_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_bundle_consultations_status ON bundle_consultations(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bundle_consultations_phone ON bundle_consultations(phone);

-- RLS 정책
ALTER TABLE bundle_consultations ENABLE ROW LEVEL SECURITY;

-- anon: INSERT만 허용 (번들 신청)
CREATE POLICY "bundle_consultations_anon_insert"
  ON bundle_consultations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- auth: SELECT + UPDATE 허용 (어드민)
CREATE POLICY "bundle_consultations_auth_select"
  ON bundle_consultations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "bundle_consultations_auth_update"
  ON bundle_consultations
  FOR UPDATE
  TO authenticated
  USING (true);
