// 당근 클론 공용 타입

export type ProductStatus = "selling" | "reserved" | "sold";

export interface Profile {
  id: string;
  phone: string;
  nickname: string;
  avatar_url: string | null;
  mannerTemp: number; // 매너 온도
  primary_neighborhood_id: string | null;
  created_at: string;
}

export interface Neighborhood {
  id: string;
  sido: string; // 시/도
  sigungu: string; // 시/군/구
  dong: string; // 동/읍/면
  fullName: string; // "서울특별시 강남구 역삼동"
  lat: number | null;
  lng: number | null;
}

export interface UserNeighborhood {
  user_id: string;
  neighborhood_id: string;
  is_primary: boolean;
  verified_at: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  neighborhood_id: string;
  title: string;
  description: string;
  price: number; // 0 = 무료나눔
  category: string;
  status: ProductStatus;
  view_count: number;
  favorite_count: number;
  chat_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
  created_at: string;
}

export interface Favorite {
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface ChatRoom {
  id: string;
  product_id: string;
  buyer_id: string;
  seller_id: string;
  last_message_at: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
}

// API 응답 형태
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
