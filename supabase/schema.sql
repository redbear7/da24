-- ============================================
-- da24 인터넷 비교 서비스 - Supabase Schema
-- ============================================

-- 통신사
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B6DF5',
  logo_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 요금제
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  provider_key TEXT NOT NULL,
  name TEXT NOT NULL,
  speed TEXT NOT NULL,
  monthly_price INT NOT NULL,
  install_fee INT DEFAULT 36000,
  contract_months INT DEFAULT 36,
  subsidy INT DEFAULT 0,
  benefits TEXT[] DEFAULT '{}',
  plan_type TEXT DEFAULT 'new' CHECK (plan_type IN ('new', 'change', 'renew', 'move')),
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 상담 신청
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  plan_type TEXT NOT NULL,
  provider TEXT NOT NULL,
  plan_id UUID REFERENCES plans(id),
  plan_name TEXT,
  address TEXT,
  memo TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_plans_provider ON plans(provider_key, plan_type);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status, created_at DESC);

-- RLS 정책
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 (providers, plans)
CREATE POLICY "providers_public_read" ON providers FOR SELECT USING (true);
CREATE POLICY "plans_public_read" ON plans FOR SELECT USING (is_active = true);

-- 상담 신청: 누구나 INSERT 가능, SELECT는 인증된 사용자만
CREATE POLICY "consultations_public_insert" ON consultations FOR INSERT WITH CHECK (true);
CREATE POLICY "consultations_auth_read" ON consultations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "consultations_auth_update" ON consultations FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================
-- 초기 데이터 시딩
-- ============================================

-- 통신사
INSERT INTO providers (key, name, color, sort_order) VALUES
  ('kt', 'KT', '#ED1C24', 1),
  ('lg', 'LG U+', '#E6007E', 2),
  ('sk', 'SK', '#FF6200', 3),
  ('other', '알뜰 인터넷', '#6B7280', 4)
ON CONFLICT (key) DO NOTHING;

-- KT 요금제 (신규가입)
INSERT INTO plans (provider_id, provider_key, name, speed, monthly_price, subsidy, benefits, plan_type, is_popular, sort_order)
SELECT p.id, 'kt', '슬림', '100M', 22000, 150000,
  ARRAY['WiFi 공유기 무료', '3년 약정 할인'], 'new', false, 1
FROM providers p WHERE p.key = 'kt'
ON CONFLICT DO NOTHING;

INSERT INTO plans (provider_id, provider_key, name, speed, monthly_price, subsidy, benefits, plan_type, is_popular, sort_order)
SELECT p.id, 'kt', '에센스', '500M', 33000, 280000,
  ARRAY['WiFi 공유기 무료', 'TV 결합 시 추가 할인', '3년 약정 할인'], 'new', true, 2
FROM providers p WHERE p.key = 'kt'
ON CONFLICT DO NOTHING;

INSERT INTO plans (provider_id, provider_key, name, speed, monthly_price, subsidy, benefits, plan_type, is_popular, sort_order)
SELECT p.id, 'kt', '프리미엄', '1G', 38500, 350000,
  ARRAY['WiFi 6 공유기 무료', 'TV 결합 시 추가 할인', '보안 서비스 무료'], 'new', false, 3
FROM providers p WHERE p.key = 'kt'
ON CONFLICT DO NOTHING;

INSERT INTO plans (provider_id, provider_key, name, speed, monthly_price, subsidy, benefits, plan_type, is_popular, sort_order)
SELECT p.id, 'kt', '10기가', '10G', 55000, 450000,
  ARRAY['WiFi 6E 공유기 무료', '프리미엄 TV 결합', '보안+클라우드 무료'], 'new', false, 4
FROM providers p WHERE p.key = 'kt'
ON CONFLICT DO NOTHING;

-- LG U+ 요금제 (신규가입)
INSERT INTO plans (provider_id, provider_key, name, speed, monthly_price, subsidy, benefits, plan_type, is_popular, sort_order)
SELECT p.id, 'lg', '슬림', '100M', 22000, 160000,
  ARRAY['WiFi 공유기 무료', '3년 약정 할인'], 'new', false, 1
FROM providers p WHERE p.key = 'lg'
ON CONFLICT DO NOTHING;

INSERT INTO plans (provider_id, provider_key, name, speed, monthly_price, subsidy, benefits, plan_type, is_popular, sort_order)
SELECT p.id, 'lg', '스마트', '500M', 33000, 300000,
  ARRAY['WiFi 공유기 무료', 'U+tv 결합 할인', '3년 약정 할인'], 'new', true, 2
FROM providers p WHERE p.key = 'lg'
ON CONFLICT DO NOTHING;

INSERT INTO plans (provider_id, provider_key, name, speed, monthly_price, subsidy, benefits, plan_type, is_popular, sort_order)
SELECT p.id, 'lg', '프리미엄', '1G', 38500, 370000,
  ARRAY['WiFi 6 공유기 무료', 'U+tv 프리미엄 결합', 'IoT 서비스 무료'], 'new', false, 3
FROM providers p WHERE p.key = 'lg'
ON CONFLICT DO NOTHING;

-- SK 요금제 (신규가입)
INSERT INTO plans (provider_id, provider_key, name, speed, monthly_price, subsidy, benefits, plan_type, is_popular, sort_order)
SELECT p.id, 'sk', '라이트', '100M', 22000, 140000,
  ARRAY['WiFi 공유기 무료', '3년 약정 할인'], 'new', false, 1
FROM providers p WHERE p.key = 'sk'
ON CONFLICT DO NOTHING;

INSERT INTO plans (provider_id, provider_key, name, speed, monthly_price, subsidy, benefits, plan_type, is_popular, sort_order)
SELECT p.id, 'sk', '스탠다드', '500M', 33000, 270000,
  ARRAY['WiFi 공유기 무료', 'B tv 결합 할인', '3년 약정 할인'], 'new', true, 2
FROM providers p WHERE p.key = 'sk'
ON CONFLICT DO NOTHING;

INSERT INTO plans (provider_id, provider_key, name, speed, monthly_price, subsidy, benefits, plan_type, is_popular, sort_order)
SELECT p.id, 'sk', '프리미엄', '1G', 38500, 340000,
  ARRAY['WiFi 6 공유기 무료', 'B tv 프리미엄 결합', '클라우드 서비스 무료'], 'new', false, 3
FROM providers p WHERE p.key = 'sk'
ON CONFLICT DO NOTHING;
