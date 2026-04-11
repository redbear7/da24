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

-- 이사 업체
CREATE TABLE IF NOT EXISTS moving_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  vehicle_count INT DEFAULT 1,
  staff_count INT DEFAULT 1,
  specialties TEXT[] DEFAULT '{}',
  description TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 프로모 배너
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  bg_color TEXT NOT NULL DEFAULT 'bg-primary',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_plans_provider ON plans(provider_key, plan_type);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_moving_companies_region ON moving_companies(region);
CREATE INDEX IF NOT EXISTS idx_banners_order ON banners(sort_order);

-- RLS 정책
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- 이사 업체 RLS
ALTER TABLE moving_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "moving_companies_public_read" ON moving_companies FOR SELECT USING (is_active = true);
CREATE POLICY "moving_companies_auth_write" ON moving_companies FOR ALL USING (auth.role() = 'authenticated');

-- 배너 RLS
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "banners_public_read" ON banners FOR SELECT USING (true);
CREATE POLICY "banners_auth_write" ON banners FOR ALL USING (auth.role() = 'authenticated');

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

-- ============================================
-- 이사 업체 시딩 (창원시 20개)
-- ============================================
INSERT INTO moving_companies (name, region, address, phone, rating, review_count, vehicle_count, staff_count, specialties, description) VALUES
  ('창원 한마음 이사', '창원시 성산구', '창원시 성산구 중앙대로 210', '055-123-4567', 4.8, 342, 5, 12, ARRAY['가정이사','포장이사'], '창원 지역 15년 전통, 꼼꼼한 포장 전문'),
  ('마산 으뜸 이사', '창원시 마산합포구', '창원시 마산합포구 해운대로 55', '055-234-5678', 4.9, 289, 4, 10, ARRAY['가정이사','사무실이사'], '마산 지역 1위, 대형 가구 전문 운반'),
  ('진해 스마트 이사', '창원시 진해구', '창원시 진해구 충장로 120', '055-345-6789', 4.7, 198, 3, 8, ARRAY['소형이사','원룸이사'], '진해 원룸/투룸 전문, 빠른 당일 이사'),
  ('창원 새벽 이사', '창원시 의창구', '창원시 의창구 원이대로 450', '055-456-7890', 4.6, 156, 6, 15, ARRAY['가정이사','보관이사'], '야간/새벽 이사 가능, 임시 보관 서비스'),
  ('경남 드림 이사', '창원시 성산구', '창원시 성산구 상남로 88', '055-567-8901', 4.5, 267, 8, 20, ARRAY['가정이사','사무실이사','공장이사'], '경남 전역 서비스, 대규모 사무실/공장 전문'),
  ('팔용동 미래 이사', '창원시 의창구', '창원시 의창구 팔용로 315', '055-678-9012', 4.4, 134, 3, 7, ARRAY['소형이사','포장이사'], '팔용동 인근 소형이사 전문'),
  ('창원 해피무브', '창원시 성산구', '창원시 성산구 용지로 177', '055-789-0123', 4.9, 412, 7, 18, ARRAY['가정이사','포장이사','에어컨'], '이사+에어컨 원스톱, 창원 최다 리뷰'),
  ('마산 프렌드 이사', '창원시 마산회원구', '창원시 마산회원구 3·15대로 620', '055-890-1234', 4.3, 98, 2, 6, ARRAY['소형이사','원룸이사'], '마산회원구 원룸 이사 최저가'),
  ('진해 럭키 이사', '창원시 진해구', '창원시 진해구 진해대로 780', '055-901-2345', 4.7, 176, 4, 9, ARRAY['가정이사','군인이사'], '진해 군부대 인근 전문, 군인 할인'),
  ('창원 번개 이사', '창원시 성산구', '창원시 성산구 창이대로 500', '055-012-3456', 4.6, 223, 5, 13, ARRAY['가정이사','긴급이사'], '당일 긴급 이사 전문, 2시간 내 출발'),
  ('상남동 정성 이사', '창원시 성산구', '창원시 성산구 상남동 65-3', '055-111-2222', 4.8, 301, 4, 11, ARRAY['가정이사','포장이사'], '상남동 아파트 이사 전문, 사다리차 보유'),
  ('중앙동 OK이사', '창원시 마산합포구', '창원시 마산합포구 중앙동 33', '055-222-3333', 4.2, 87, 2, 5, ARRAY['소형이사'], '중앙동 인근 소형이사 합리적 가격'),
  ('창원 VIP 이사', '창원시 의창구', '창원시 의창구 봉곡로 210', '055-333-4444', 4.9, 189, 6, 16, ARRAY['가정이사','프리미엄이사'], '고급 가구 전문 운반, 프리미엄 포장'),
  ('북면 하나 이사', '창원시 의창구', '창원시 의창구 북면 감천로 45', '055-444-5555', 4.5, 65, 3, 7, ARRAY['가정이사','농촌이사'], '북면/대산 외곽 지역 전문'),
  ('창원 퍼스트 이사', '창원시 성산구', '창원시 성산구 남산로 89', '055-555-6666', 4.7, 256, 5, 14, ARRAY['가정이사','사무실이사'], '창원 산업단지 사무실 이사 전문'),
  ('진해 바다 이사', '창원시 진해구', '창원시 진해구 경화로 55', '055-666-7777', 4.4, 112, 3, 8, ARRAY['가정이사','소형이사'], '진해 해군기지 인근 전문'),
  ('마산 굿모닝 이사', '창원시 마산회원구', '창원시 마산회원구 양덕로 340', '055-777-8888', 4.6, 178, 4, 10, ARRAY['가정이사','포장이사'], '양덕동 대단지 아파트 이사 전문'),
  ('창원 안심 이사', '창원시 성산구', '창원시 성산구 반송로 120', '055-888-9999', 4.8, 334, 6, 15, ARRAY['가정이사','보험이사'], '물품 파손 시 100% 보상, 보험 가입'),
  ('내서 행복 이사', '창원시 마산합포구', '창원시 마산합포구 내서읍 광려로 88', '055-999-0000', 4.3, 76, 2, 6, ARRAY['소형이사','원룸이사'], '내서읍 저렴한 원룸 이사'),
  ('창원 종합 이사센터', '창원시 의창구', '창원시 의창구 용동로 250', '055-100-2000', 4.7, 445, 10, 25, ARRAY['가정이사','사무실이사','공장이사','보관이사'], '창원 최대 규모, 모든 이사 유형 대응')
ON CONFLICT DO NOTHING;
