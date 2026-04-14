-- ============================================
-- 번들 상담 (Bundle Consultations) Schema
-- ============================================

-- 번들 상담 신청 (패키지 묶음 견적 요청)
CREATE TABLE IF NOT EXISTS bundle_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                         -- 고객명
  phone TEXT NOT NULL,                        -- 연락처
  package_type TEXT NOT NULL                  -- 패키지 유형
    CHECK (package_type IN ('internet_moving', 'internet_clean', 'moving_clean', 'all')),
  -- 서비스별 상태 (해당 서비스가 포함된 패키지에만 적용)
  internet_status TEXT DEFAULT 'pending'
    CHECK (internet_status IN ('pending', 'matched', 'done')),
  moving_status TEXT DEFAULT 'pending'
    CHECK (moving_status IN ('pending', 'matched', 'done')),
  clean_status TEXT DEFAULT 'pending'
    CHECK (clean_status IN ('pending', 'matched', 'done')),
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_bundle_consultations_package_type
  ON bundle_consultations(package_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bundle_consultations_created_at
  ON bundle_consultations(created_at DESC);

-- RLS
ALTER TABLE bundle_consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bundle_consultations_service_role_all"
  ON bundle_consultations FOR ALL
  USING (true)
  WITH CHECK (true);
