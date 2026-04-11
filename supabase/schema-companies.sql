-- 이사 업체 테이블
CREATE TABLE IF NOT EXISTS moving_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 4.5,
  review_count INT DEFAULT 0,
  vehicle_count INT DEFAULT 3,
  staff_count INT DEFAULT 8,
  specialties TEXT[] DEFAULT '{}',
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE moving_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "companies_public_read" ON moving_companies FOR SELECT USING (true);
CREATE POLICY "companies_auth_insert" ON moving_companies FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "companies_auth_update" ON moving_companies FOR UPDATE USING (true);
CREATE POLICY "companies_auth_delete" ON moving_companies FOR DELETE USING (true);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_companies_region ON moving_companies(region);

-- 창원시 더미 업체 10개 시딩
INSERT INTO moving_companies (name, region, address, phone, rating, review_count, vehicle_count, staff_count, specialties, description) VALUES
('창원 한마음 이사', '창원시 성산구', '창원시 성산구 중앙대로 210', '01085757863', 4.8, 342, 5, 12, ARRAY['가정이사', '포장이사'], '창원 지역 15년 전통, 꼼꼼한 포장 전문'),
('마산 으뜸 이사', '창원시 마산합포구', '창원시 마산합포구 해운대로 55', '01085757863', 4.9, 289, 4, 10, ARRAY['가정이사', '사무실이사'], '마산 지역 1위, 대형 가구 전문 운반'),
('진해 스마트 이사', '창원시 진해구', '창원시 진해구 충장로 120', '01085757863', 4.7, 198, 3, 8, ARRAY['소형이사', '원룸이사'], '진해 원룸/투룸 전문, 빠른 당일 이사'),
('창원 해피무브', '창원시 성산구', '창원시 성산구 용지로 177', '01085757863', 4.9, 412, 7, 18, ARRAY['가정이사', '포장이사', '에어컨'], '이사+에어컨 원스톱, 창원 최다 리뷰'),
('경남 드림 이사', '창원시 성산구', '창원시 성산구 상남로 88', '01085757863', 4.5, 267, 8, 20, ARRAY['가정이사', '사무실이사', '공장이사'], '경남 전역 서비스, 대규모 사무실/공장 전문'),
('창원 VIP 이사', '창원시 의창구', '창원시 의창구 봉곡로 210', '01085757863', 4.9, 189, 6, 16, ARRAY['가정이사', '프리미엄이사'], '고급 가구 전문 운반, 프리미엄 포장'),
('마산 굿모닝 이사', '창원시 마산회원구', '창원시 마산회원구 양덕로 340', '01085757863', 4.6, 178, 4, 10, ARRAY['가정이사', '포장이사'], '양덕동 대단지 아파트 이사 전문'),
('창원 안심 이사', '창원시 성산구', '창원시 성산구 반송로 120', '01085757863', 4.8, 334, 6, 15, ARRAY['가정이사', '보관이사'], '물품 파손 시 100% 보상, 보험 가입'),
('진해 럭키 이사', '창원시 진해구', '창원시 진해구 진해대로 780', '01085757863', 4.7, 176, 4, 9, ARRAY['가정이사', '군인이사'], '진해 군부대 인근 전문, 군인 할인'),
('창원 종합 이사센터', '창원시 의창구', '창원시 의창구 용동로 250', '01085757863', 4.7, 445, 10, 25, ARRAY['가정이사', '사무실이사', '공장이사', '보관이사'], '창원 최대 규모, 모든 이사 유형 대응');
