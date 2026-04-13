-- 고객 리뷰 테이블
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  date TEXT NOT NULL,
  subsidy TEXT DEFAULT '',
  text TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  service_type TEXT NOT NULL CHECK (service_type IN ('moving', 'clean', 'internet', 'aircon')),
  region TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 프로모 배너 테이블
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eyebrow TEXT NOT NULL,
  title TEXT NOT NULL,
  bg_class TEXT DEFAULT 'bg-primary',
  link TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "reviews_update" ON reviews FOR UPDATE USING (true);
CREATE POLICY "reviews_delete" ON reviews FOR DELETE USING (true);
CREATE POLICY "banners_public_read" ON banners FOR SELECT USING (is_active = true);
CREATE POLICY "banners_insert" ON banners FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "banners_update" ON banners FOR UPDATE USING (true);
CREATE POLICY "banners_delete" ON banners FOR DELETE USING (true);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_reviews_service ON reviews(service_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_banners_order ON banners(sort_order);

-- 리뷰 더미 데이터 (창원시, 20개)
INSERT INTO reviews (name, rating, date, subsidy, text, tags, service_type, region) VALUES
('이**', 5, '2026.03.28', '', '창원시 성산구에서 의창구로 이사했는데, 기사님들이 정말 친절하고 꼼꼼하게 포장해 주셨어요.', ARRAY['친절한 상담', '꼼꼼한 포장', '시간 준수'], 'moving', '창원시 성산구'),
('채**', 5, '2026.03.25', '', '마산에서 진해로 이사했어요. 비 오는 날이었는데도 방수 포장까지 해주시고 정말 감동이었습니다.', ARRAY['빠른 응대', '친절한 상담', '자세한 상담'], 'moving', '창원시 마산합포구'),
('조**', 4, '2026.03.20', '', '전반적으로 만족스러웠어요. 다만 시간이 조금 지연된 점이 아쉬웠습니다.', ARRAY['자세한 상담'], 'moving', '창원시 의창구'),
('박**', 5, '2026.03.18', '', '용지동 아파트에서 상남동으로 옮겼는데, 사다리차 작업도 완벽했고 가격도 합리적이었습니다.', ARRAY['빠른 응대', '합리적 가격', '꼼꼼한 포장'], 'moving', '창원시 성산구'),
('김**', 5, '2026.03.15', '', '원룸 이사라 짐이 적었는데도 성심성의껏 해주셨어요. 1시간 만에 끝나서 놀랐습니다.', ARRAY['빠른 응대', '합리적 가격'], 'moving', '창원시 진해구'),
('정**', 5, '2026.03.27', '', '입주 전 청소를 맡겼는데 새 집처럼 깨끗해졌어요. 화장실 곰팡이까지 싹 제거해 주셨어요.', ARRAY['꼼꼼한 청소', '친절한 상담'], 'clean', '창원시 성산구'),
('한**', 4, '2026.03.22', '', '마산 아파트 입주청소 했어요. 전체적으로 깨끗하게 해주셨는데 베란다 창틀이 좀 아쉬웠어요.', ARRAY['합리적 가격'], 'clean', '창원시 마산회원구'),
('최**', 5, '2026.03.19', '', '30평 아파트 입주청소인데 4시간 만에 끝내주셨어요. 주방 후드 기름때까지 완벽하게 제거!', ARRAY['빠른 작업', '꼼꼼한 청소', '자세한 상담'], 'clean', '창원시 의창구'),
('이**', 5, '2026.03.26', '470,000원 + 비밀지원금', '자세한 상담은 물론 친절하시고, 시간맞춰 연락 주셔서 잘 해결 했습니다', ARRAY['빠른응대', '친절한 상담', '자세한 상담'], 'internet', '창원시 성산구'),
('채**', 5, '2026.03.26', '480,000원 + 비밀지원금', '별 기대 안하고 했는데, 상담사분이 너무 친절해서 만족스러웠어요. 추천합니다!', ARRAY['빠른 응대', '친절한 상담', '높은 사은품 가격'], 'internet', '창원시 마산합포구'),
('조**', 4, '2026.03.24', '480,000원 + 비밀지원금', '긴 시간을 두고 천천히 생각할 수 있게끔 해주어 좋았음.', ARRAY['자세한 상담'], 'internet', '창원시 진해구'),
('이**', 5, '2026.03.22', '480,000원 + 비밀지원금', '사은품 최대로 주시고 친절하셔서 대만족이에요! 주변에도 추천할게요', ARRAY['친절한 상담', '높은 사은품 가격'], 'internet', '창원시 의창구'),
('강**', 5, '2026.03.20', '450,000원 + 비밀지원금', 'KT에서 LG로 변경했는데 지원금도 많이 받고 속도도 빨라져서 만족합니다.', ARRAY['빠른 응대', '높은 사은품 가격'], 'internet', '창원시 성산구'),
('윤**', 5, '2026.03.25', '', '이사하면서 에어컨 2대 이전 설치했는데, 깔끔하게 해주셨어요. 배관 작업도 꼼꼼합니다.', ARRAY['꼼꼼한 설치', '합리적 가격'], 'aircon', '창원시 성산구'),
('서**', 4, '2026.03.21', '', '에어컨 신규 설치했는데 시간 약속 잘 지키시고 설치 후 작동 테스트까지 해주셨어요.', ARRAY['시간 준수', '자세한 설명'], 'aircon', '창원시 마산회원구'),
('임**', 5, '2026.03.17', '', '진해에서 에어컨 철거+재설치 했는데 추가 비용 없이 견적 그대로 진행해 주셨습니다.', ARRAY['투명한 가격', '친절한 상담', '꼼꼼한 설치'], 'aircon', '창원시 진해구'),
('송**', 5, '2026.03.12', '', '팔용동에서 봉곡동으로 이사했어요. 5톤 트럭으로 한 번에 다 옮겨주셨습니다.', ARRAY['빠른 응대', '꼼꼼한 포장', '가구 배치'], 'moving', '창원시 의창구'),
('문**', 4, '2026.03.10', '', '사무실 이사였는데 직원분들이 사무 가구를 조심스럽게 다뤄주셔서 좋았습니다.', ARRAY['주말 이사', '자세한 상담'], 'moving', '창원시 성산구'),
('황**', 5, '2026.03.08', '', '양덕동 신축 아파트로 이사했는데, 바닥 보양 작업까지 꼼꼼하게 해주셨어요.', ARRAY['바닥 보양', '꼼꼼한 포장', '친절한 상담'], 'moving', '창원시 마산회원구'),
('노**', 5, '2026.03.05', '', '창원에서 김해로 장거리 이사였는데 추가 비용 없이 깔끔하게 처리해 주셨습니다.', ARRAY['투명한 가격', '장거리 전문', '친절한 상담'], 'moving', '창원시 성산구');

-- 배너 더미 데이터
INSERT INTO banners (eyebrow, title, bg_class, sort_order) VALUES
('이사 지원금 당첨 확률 2배!', '인터넷 가입 지원금 추가 지급!', 'bg-primary', 1),
('에어컨 설치 비가지 요금?', '의심, 걱정 없이 끝!', 'bg-foreground', 2),
('780만 고객이 선택한 다이사', '이사업체 비교의 새로운 기준', 'bg-primary', 3);
