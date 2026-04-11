export interface MovingCompany {
  id: string;
  name: string;
  region: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  vehicleCount: number;
  staffCount: number;
  specialties: string[];
  description: string;
}

export const DUMMY_COMPANIES: MovingCompany[] = [
  { id: "mc-01", name: "창원 한마음 이사", region: "창원시 성산구", address: "창원시 성산구 중앙대로 210", phone: "055-123-4567", rating: 4.8, reviewCount: 342, vehicleCount: 5, staffCount: 12, specialties: ["가정이사", "포장이사"], description: "창원 지역 15년 전통, 꼼꼼한 포장 전문" },
  { id: "mc-02", name: "마산 으뜸 이사", region: "창원시 마산합포구", address: "창원시 마산합포구 해운대로 55", phone: "055-234-5678", rating: 4.9, reviewCount: 289, vehicleCount: 4, staffCount: 10, specialties: ["가정이사", "사무실이사"], description: "마산 지역 1위, 대형 가구 전문 운반" },
  { id: "mc-03", name: "진해 스마트 이사", region: "창원시 진해구", address: "창원시 진해구 충장로 120", phone: "055-345-6789", rating: 4.7, reviewCount: 198, vehicleCount: 3, staffCount: 8, specialties: ["소형이사", "원룸이사"], description: "진해 원룸/투룸 전문, 빠른 당일 이사" },
  { id: "mc-04", name: "창원 새벽 이사", region: "창원시 의창구", address: "창원시 의창구 원이대로 450", phone: "055-456-7890", rating: 4.6, reviewCount: 156, vehicleCount: 6, staffCount: 15, specialties: ["가정이사", "보관이사"], description: "야간/새벽 이사 가능, 임시 보관 서비스" },
  { id: "mc-05", name: "경남 드림 이사", region: "창원시 성산구", address: "창원시 성산구 상남로 88", phone: "055-567-8901", rating: 4.5, reviewCount: 267, vehicleCount: 8, staffCount: 20, specialties: ["가정이사", "사무실이사", "공장이사"], description: "경남 전역 서비스, 대규모 사무실/공장 전문" },
  { id: "mc-06", name: "팔용동 미래 이사", region: "창원시 의창구", address: "창원시 의창구 팔용로 315", phone: "055-678-9012", rating: 4.4, reviewCount: 134, vehicleCount: 3, staffCount: 7, specialties: ["소형이사", "포장이사"], description: "팔용동 인근 소형이사 전문" },
  { id: "mc-07", name: "창원 해피무브", region: "창원시 성산구", address: "창원시 성산구 용지로 177", phone: "055-789-0123", rating: 4.9, reviewCount: 412, vehicleCount: 7, staffCount: 18, specialties: ["가정이사", "포장이사", "에어컨"], description: "이사+에어컨 원스톱, 창원 최다 리뷰" },
  { id: "mc-08", name: "마산 프렌드 이사", region: "창원시 마산회원구", address: "창원시 마산회원구 3·15대로 620", phone: "055-890-1234", rating: 4.3, reviewCount: 98, vehicleCount: 2, staffCount: 6, specialties: ["소형이사", "원룸이사"], description: "마산회원구 원룸 이사 최저가" },
  { id: "mc-09", name: "진해 럭키 이사", region: "창원시 진해구", address: "창원시 진해구 진해대로 780", phone: "055-901-2345", rating: 4.7, reviewCount: 176, vehicleCount: 4, staffCount: 9, specialties: ["가정이사", "군인이사"], description: "진해 군부대 인근 전문, 군인 할인" },
  { id: "mc-10", name: "창원 번개 이사", region: "창원시 성산구", address: "창원시 성산구 창이대로 500", phone: "055-012-3456", rating: 4.6, reviewCount: 223, vehicleCount: 5, staffCount: 13, specialties: ["가정이사", "긴급이사"], description: "당일 긴급 이사 전문, 2시간 내 출발" },
  { id: "mc-11", name: "상남동 정성 이사", region: "창원시 성산구", address: "창원시 성산구 상남동 65-3", phone: "055-111-2222", rating: 4.8, reviewCount: 301, vehicleCount: 4, staffCount: 11, specialties: ["가정이사", "포장이사"], description: "상남동 아파트 이사 전문, 사다리차 보유" },
  { id: "mc-12", name: "중앙동 OK이사", region: "창원시 마산합포구", address: "창원시 마산합포구 중앙동 33", phone: "055-222-3333", rating: 4.2, reviewCount: 87, vehicleCount: 2, staffCount: 5, specialties: ["소형이사"], description: "중앙동 인근 소형이사 합리적 가격" },
  { id: "mc-13", name: "창원 VIP 이사", region: "창원시 의창구", address: "창원시 의창구 봉곡로 210", phone: "055-333-4444", rating: 4.9, reviewCount: 189, vehicleCount: 6, staffCount: 16, specialties: ["가정이사", "프리미엄이사"], description: "고급 가구 전문 운반, 프리미엄 포장" },
  { id: "mc-14", name: "북면 하나 이사", region: "창원시 의창구", address: "창원시 의창구 북면 감천로 45", phone: "055-444-5555", rating: 4.5, reviewCount: 65, vehicleCount: 3, staffCount: 7, specialties: ["가정이사", "농촌이사"], description: "북면/대산 외곽 지역 전문" },
  { id: "mc-15", name: "창원 퍼스트 이사", region: "창원시 성산구", address: "창원시 성산구 남산로 89", phone: "055-555-6666", rating: 4.7, reviewCount: 256, vehicleCount: 5, staffCount: 14, specialties: ["가정이사", "사무실이사"], description: "창원 산업단지 사무실 이사 전문" },
  { id: "mc-16", name: "진해 바다 이사", region: "창원시 진해구", address: "창원시 진해구 경화로 55", phone: "055-666-7777", rating: 4.4, reviewCount: 112, vehicleCount: 3, staffCount: 8, specialties: ["가정이사", "소형이사"], description: "진해 해군기지 인근 전문" },
  { id: "mc-17", name: "마산 굿모닝 이사", region: "창원시 마산회원구", address: "창원시 마산회원구 양덕로 340", phone: "055-777-8888", rating: 4.6, reviewCount: 178, vehicleCount: 4, staffCount: 10, specialties: ["가정이사", "포장이사"], description: "양덕동 대단지 아파트 이사 전문" },
  { id: "mc-18", name: "창원 안심 이사", region: "창원시 성산구", address: "창원시 성산구 반송로 120", phone: "055-888-9999", rating: 4.8, reviewCount: 334, vehicleCount: 6, staffCount: 15, specialties: ["가정이사", "보험이사"], description: "물품 파손 시 100% 보상, 보험 가입" },
  { id: "mc-19", name: "내서 행복 이사", region: "창원시 마산합포구", address: "창원시 마산합포구 내서읍 광려로 88", phone: "055-999-0000", rating: 4.3, reviewCount: 76, vehicleCount: 2, staffCount: 6, specialties: ["소형이사", "원룸이사"], description: "내서읍 저렴한 원룸 이사" },
  { id: "mc-20", name: "창원 종합 이사센터", region: "창원시 의창구", address: "창원시 의창구 용동로 250", phone: "055-100-2000", rating: 4.7, reviewCount: 445, vehicleCount: 10, staffCount: 25, specialties: ["가정이사", "사무실이사", "공장이사", "보관이사"], description: "창원 최대 규모, 모든 이사 유형 대응" },
];
