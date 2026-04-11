export interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  subsidy: string;
  text: string;
  tags: string[];
  serviceType: "moving" | "clean" | "internet" | "aircon";
  region: string;
}

export const DUMMY_REVIEWS: Review[] = [
  // 이사 리뷰
  { id: "r-01", name: "이**", rating: 5, date: "2026.03.28", subsidy: "", text: "창원시 성산구에서 의창구로 이사했는데, 기사님들이 정말 친절하고 꼼꼼하게 포장해 주셨어요. 대형 가구도 흠집 하나 없이 옮겨주셨습니다.", tags: ["친절한 상담", "꼼꼼한 포장", "시간 준수"], serviceType: "moving", region: "창원시 성산구" },
  { id: "r-02", name: "채**", rating: 5, date: "2026.03.25", subsidy: "", text: "마산에서 진해로 이사했어요. 비 오는 날이었는데도 방수 포장까지 해주시고 정말 감동이었습니다. 다음에도 꼭 이 업체로 할 거예요!", tags: ["빠른 응대", "친절한 상담", "자세한 상담"], serviceType: "moving", region: "창원시 마산합포구" },
  { id: "r-03", name: "조**", rating: 4, date: "2026.03.20", subsidy: "", text: "전반적으로 만족스러웠어요. 다만 시간이 조금 지연된 점이 아쉬웠습니다. 짐 정리는 깔끔하게 해주셨습니다.", tags: ["자세한 상담"], serviceType: "moving", region: "창원시 의창구" },
  { id: "r-04", name: "박**", rating: 5, date: "2026.03.18", subsidy: "", text: "용지동 아파트에서 상남동으로 옮겼는데, 사다리차 작업도 완벽했고 가격도 합리적이었습니다. 강력 추천합니다!", tags: ["빠른 응대", "합리적 가격", "꼼꼼한 포장"], serviceType: "moving", region: "창원시 성산구" },
  { id: "r-05", name: "김**", rating: 5, date: "2026.03.15", subsidy: "", text: "원룸 이사라 짐이 적었는데도 성심성의껏 해주셨어요. 1시간 만에 끝나서 놀랐습니다. 가격도 저렴하고 최고!", tags: ["빠른 응대", "합리적 가격"], serviceType: "moving", region: "창원시 진해구" },

  // 청소 리뷰
  { id: "r-06", name: "정**", rating: 5, date: "2026.03.27", subsidy: "", text: "입주 전 청소를 맡겼는데 새 집처럼 깨끗해졌어요. 화장실 곰팡이까지 싹 제거해 주셨어요. 창원 입주청소는 여기!", tags: ["꼼꼼한 청소", "친절한 상담"], serviceType: "clean", region: "창원시 성산구" },
  { id: "r-07", name: "한**", rating: 4, date: "2026.03.22", subsidy: "", text: "마산 아파트 입주청소 했어요. 전체적으로 깨끗하게 해주셨는데 베란다 창틀이 좀 아쉬웠어요. 그래도 가성비 좋습니다.", tags: ["합리적 가격"], serviceType: "clean", region: "창원시 마산회원구" },
  { id: "r-08", name: "최**", rating: 5, date: "2026.03.19", subsidy: "", text: "30평 아파트 입주청소인데 4시간 만에 끝내주셨어요. 주방 후드 기름때까지 완벽하게 제거! 진짜 프로입니다.", tags: ["빠른 작업", "꼼꼼한 청소", "자세한 상담"], serviceType: "clean", region: "창원시 의창구" },

  // 인터넷 리뷰
  { id: "r-09", name: "이**", rating: 5, date: "2026.03.26", subsidy: "470,000원 + 비밀지원금", text: "자세한 상담은 물론 친절하시고, 시간맞춰 연락 주셔서 잘 해결 했습니다", tags: ["빠른응대", "친절한 상담", "자세한 상담"], serviceType: "internet", region: "창원시 성산구" },
  { id: "r-10", name: "채**", rating: 5, date: "2026.03.26", subsidy: "480,000원 + 비밀지원금", text: "별 기대 안하고 했는데, 상담사분이 너무 친절해서 만족스러웠어요. 인터넷 추천합니다 ㅎ 상담해주신 분 감사합니다.!", tags: ["빠른 응대", "친절한 상담", "자세한 상담", "높은 사은품 가격"], serviceType: "internet", region: "창원시 마산합포구" },
  { id: "r-11", name: "조**", rating: 4, date: "2026.03.24", subsidy: "480,000원 + 비밀지원금", text: "긴 시간을 두고 천천히 생각할 수 있게끔 해주어 좋았음. 향후 알뜰 인터넷 가입이 가능하게끔 진행해주셨으면 함", tags: ["자세한 상담"], serviceType: "internet", region: "창원시 진해구" },
  { id: "r-12", name: "이**", rating: 5, date: "2026.03.22", subsidy: "480,000원 + 비밀지원금", text: "사은품 최대로 주시고 친절하셔서 대만족이에요! 감사합니다 주변에도 추천할게요", tags: ["친절한 상담", "높은 사은품 가격"], serviceType: "internet", region: "창원시 의창구" },
  { id: "r-13", name: "강**", rating: 5, date: "2026.03.20", subsidy: "450,000원 + 비밀지원금", text: "KT에서 LG로 변경했는데 지원금도 많이 받고 속도도 빨라져서 만족합니다. 창원 인터넷 가입은 여기서!", tags: ["빠른 응대", "높은 사은품 가격"], serviceType: "internet", region: "창원시 성산구" },

  // 에어컨 리뷰
  { id: "r-14", name: "윤**", rating: 5, date: "2026.03.25", subsidy: "", text: "이사하면서 에어컨 2대 이전 설치했는데, 깔끔하게 해주셨어요. 배관 작업도 꼼꼼하고 가격도 합리적이었습니다.", tags: ["꼼꼼한 설치", "합리적 가격"], serviceType: "aircon", region: "창원시 성산구" },
  { id: "r-15", name: "서**", rating: 4, date: "2026.03.21", subsidy: "", text: "에어컨 신규 설치했는데 시간 약속 잘 지키시고 설치 후 작동 테스트까지 해주셨어요. 좋습니다.", tags: ["시간 준수", "자세한 설명"], serviceType: "aircon", region: "창원시 마산회원구" },
  { id: "r-16", name: "임**", rating: 5, date: "2026.03.17", subsidy: "", text: "진해에서 에어컨 철거+재설치 했는데 추가 비용 없이 견적 그대로 진행해 주셔서 믿음이 갔습니다. 강추!", tags: ["투명한 가격", "친절한 상담", "꼼꼼한 설치"], serviceType: "aircon", region: "창원시 진해구" },

  // 추가 이사 리뷰
  { id: "r-17", name: "송**", rating: 5, date: "2026.03.12", subsidy: "", text: "팔용동에서 봉곡동으로 이사했어요. 5톤 트럭으로 한 번에 다 옮겨주시고, 가구 배치까지 도와주셨습니다. 완벽해요!", tags: ["빠른 응대", "꼼꼼한 포장", "가구 배치"], serviceType: "moving", region: "창원시 의창구" },
  { id: "r-18", name: "문**", rating: 4, date: "2026.03.10", subsidy: "", text: "사무실 이사였는데 직원분들이 사무 가구를 조심스럽게 다뤄주셔서 좋았습니다. 주말 이사도 가능해서 편했어요.", tags: ["주말 이사", "자세한 상담"], serviceType: "moving", region: "창원시 성산구" },
  { id: "r-19", name: "황**", rating: 5, date: "2026.03.08", subsidy: "", text: "양덕동 신축 아파트로 이사했는데, 바닥 보양 작업까지 꼼꼼하게 해주셨어요. 흠집 걱정 전혀 없었습니다.", tags: ["바닥 보양", "꼼꼼한 포장", "친절한 상담"], serviceType: "moving", region: "창원시 마산회원구" },
  { id: "r-20", name: "노**", rating: 5, date: "2026.03.05", subsidy: "", text: "창원에서 김해로 장거리 이사였는데 추가 비용 없이 깔끔하게 처리해 주셨습니다. 진짜 양심적인 업체예요.", tags: ["투명한 가격", "장거리 전문", "친절한 상담"], serviceType: "moving", region: "창원시 성산구" },
];
