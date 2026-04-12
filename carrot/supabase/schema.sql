-- ============================================
-- 당근마켓 클론 - Supabase Schema
-- ============================================
-- 핵심 기능:
--   1. 인증 (휴대폰 + SMS) — Supabase Auth 연동
--   2. 동네 인증/검색/관심
--   3. 중고거래 글 CRUD + 이미지
--   4. 1:1 실시간 채팅 (Realtime)
-- ============================================

-- UUID / 시간 함수는 Supabase 기본 탑재
-- auth.users 테이블은 Supabase Auth가 관리

-- ============================================
-- 1. 프로필 (auth.users 1:1)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  nickname TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  manner_temp NUMERIC(4,1) DEFAULT 36.5,
  primary_neighborhood_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_nickname ON profiles(nickname);

-- ============================================
-- 2. 동네 (법정동 기반)
-- ============================================
CREATE TABLE IF NOT EXISTS neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sido TEXT NOT NULL,
  sigungu TEXT NOT NULL,
  dong TEXT NOT NULL,
  full_name TEXT GENERATED ALWAYS AS (sido || ' ' || sigungu || ' ' || dong) STORED,
  lat NUMERIC(10,7),
  lng NUMERIC(10,7),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (sido, sigungu, dong)
);

CREATE INDEX IF NOT EXISTS idx_neighborhoods_fullname ON neighborhoods USING gin (to_tsvector('simple', full_name));
CREATE INDEX IF NOT EXISTS idx_neighborhoods_dong ON neighborhoods(dong);

-- 사용자 ↔ 동네 (최대 2개, 그 중 primary 1개)
CREATE TABLE IF NOT EXISTS user_neighborhoods (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, neighborhood_id)
);

CREATE INDEX IF NOT EXISTS idx_user_neighborhoods_user ON user_neighborhoods(user_id);

-- ============================================
-- 3. 상품 (중고거래 글)
-- ============================================
CREATE TYPE product_status AS ENUM ('selling', 'reserved', 'sold');

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 2 AND 60),
  description TEXT NOT NULL CHECK (char_length(description) BETWEEN 10 AND 2000),
  price INT NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL,
  status product_status NOT NULL DEFAULT 'selling',
  view_count INT NOT NULL DEFAULT 0,
  favorite_count INT NOT NULL DEFAULT 0,
  chat_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_neighborhood ON products(neighborhood_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id, sort_order);

-- 관심 상품
CREATE TABLE IF NOT EXISTS favorites (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id, created_at DESC);

-- ============================================
-- 4. 채팅 (1:1 실시간)
-- ============================================
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (product_id, buyer_id),
  CHECK (buyer_id <> seller_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_rooms_buyer ON chat_rooms(buyer_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_seller ON chat_rooms(seller_id, last_message_at DESC);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages(room_id, created_at);

-- 메시지 insert 시 chat_rooms.last_message_at 갱신
CREATE OR REPLACE FUNCTION update_chat_room_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_rooms
  SET last_message_at = NEW.created_at
  WHERE id = NEW.room_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_chat_messages_touch_room ON chat_messages;
CREATE TRIGGER trg_chat_messages_touch_room
AFTER INSERT ON chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_chat_room_last_message();

-- ============================================
-- Row Level Security
-- ============================================
ALTER TABLE profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods         ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_neighborhoods    ENABLE ROW LEVEL SECURITY;
ALTER TABLE products              ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images        ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites             ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms            ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages         ENABLE ROW LEVEL SECURITY;

-- profiles: 공개 읽기, 본인만 수정
CREATE POLICY "profiles_public_read" ON profiles
  FOR SELECT USING (true);
CREATE POLICY "profiles_self_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_self_insert" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- neighborhoods: 공개 읽기
CREATE POLICY "neighborhoods_public_read" ON neighborhoods
  FOR SELECT USING (true);

-- user_neighborhoods: 본인만 조회/변경
CREATE POLICY "user_neighborhoods_self_all" ON user_neighborhoods
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- products: 공개 읽기, 판매자만 수정/삭제
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (true);
CREATE POLICY "products_seller_insert" ON products
  FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "products_seller_update" ON products
  FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "products_seller_delete" ON products
  FOR DELETE USING (auth.uid() = seller_id);

-- product_images: 상품 공개 읽기, 판매자만 쓰기
CREATE POLICY "product_images_public_read" ON product_images
  FOR SELECT USING (true);
CREATE POLICY "product_images_seller_write" ON product_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_images.product_id AND p.seller_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_images.product_id AND p.seller_id = auth.uid()
    )
  );

-- favorites: 본인만
CREATE POLICY "favorites_self_all" ON favorites
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- chat_rooms: 참여자만
CREATE POLICY "chat_rooms_participants_select" ON chat_rooms
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "chat_rooms_buyer_insert" ON chat_rooms
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- chat_messages: 방 참여자만 조회/전송
CREATE POLICY "chat_messages_participants_select" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_rooms r
      WHERE r.id = chat_messages.room_id
        AND (r.buyer_id = auth.uid() OR r.seller_id = auth.uid())
    )
  );
CREATE POLICY "chat_messages_participants_insert" ON chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM chat_rooms r
      WHERE r.id = chat_messages.room_id
        AND (r.buyer_id = auth.uid() OR r.seller_id = auth.uid())
    )
  );

-- ============================================
-- Storage 버킷 (이미지 업로드)
--   Supabase 대시보드에서 생성하거나 별도 SQL 실행:
--   INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);
-- ============================================

-- ============================================
-- Realtime 활성화 (채팅)
--   ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
--   ALTER PUBLICATION supabase_realtime ADD TABLE chat_rooms;
-- ============================================
