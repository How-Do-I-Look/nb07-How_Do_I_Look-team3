import { BadRequestError } from "../../errors/errorHandler.js";

export class Ranking {
  constructor(ranking, rating) {
    this.ranking = ranking;
    this.rating = rating;
  }
  static fromEntity(data) {
    return new Ranking({
      ranking: data.ranking,
      rating: data.rating,
    });
  }
}
// ranking
// rating
// const dummyData = {
//   currentPage: 1,
//   totalPages: 5,
//   totalItemCount: 50,
//   data: [
//     {
//       id: "21",
//       nickname: "스트릿몬",
//       title: "1111겨울 감성 스트릿핏 완성 더미데이터",
//       content:
//         "asdfasdf확인용 도쿄 여행 중 편하게 돌아다닌 데일리룩입니다. 톤온톤으로 맞추고, 아우터는 살짝 오버핏으로 골라 레이어드 느낌을 살렸어요 더미데이터.",
//       viewCount: 0,
//       curationCount: 10,
//       categories: {
//         top: {
//           name: "워싱 로고 후디1",
//           brand: "Stussy",
//           price: 98000,
//         },
//         bottom: {
//           name: "와이드 데님 팬츠2",
//           brand: "Levis",
//           price: 129000,
//         },
//         outer: {
//           name: "리버시블 플리스 재킷",
//           brand: "The North Face",
//           price: 219000,
//         },
//         shoes: {
//           name: "990v6 그레이",
//           brand: "New Balance",
//           price: 289000,
//         },
//         bag: {
//           name: "크로스바디 메신저백",
//           brand: "PORTER",
//           price: 189000,
//         },
//         accessory: {
//           name: "비니",
//           brand: "Carhartt WIP",
//           price: 39000,
//         },
//       },
//       tags: ["스트릿패션", "데일리룩"],
//       imageUrls: [
//         "https://dummyimage.com/ffffff&text=look1",
//         "https://dummyimage.com/ffffff&text=look2",
//       ],
//       curations: [
//         {
//           id: "82",
//           styleId: "21",
//           nickname: "뷰어1",
//           content: "트렌디한 느낌이 살아있네요!ㅋㅋㅋ",
//           trendy: 10,
//           personality: 10,
//           practicality: 8,
//           costEffectiveness: 5,
//           createAt: "2025-12-16T00:42:54.981Z",
//           updateAt: "2025-12-16T00:42:54.981Z",
//           reply: null,
//         },
//         {
//           id: "81",
//           styleId: "21",
//           nickname: "뷰어1",
//           content: "트렌디한 느낌이 살아있네요!ㅋㅋㅋ",
//           trendy: 9,
//           personality: 7,
//           practicality: 8,
//           costEffectiveness: 5,
//           createAt: "2025-12-16T00:42:54.899Z",
//           updateAt: "2025-12-16T00:42:54.899Z",
//           reply: null,
//         },
//         {
//           id: "80",
//           styleId: "21",
//           nickname: "뷰어1",
//           content: "트렌디한 느낌이 살아있네요!ㅋㅋㅋ",
//           trendy: 9,
//           personality: 7,
//           practicality: 8,
//           costEffectiveness: 5,
//           createAt: "2025-12-16T00:42:54.819Z",
//           updateAt: "2025-12-16T00:42:54.819Z",
//           reply: null,
//         },
//         {
//           id: "79",
//           styleId: "21",
//           nickname: "뷰어1",
//           content: "트렌디한 느낌이 살아있네요!ㅋㅋㅋ",
//           trendy: 9,
//           personality: 7,
//           practicality: 8,
//           costEffectiveness: 5,
//           createAt: "2025-12-16T00:42:54.737Z",
//           updateAt: "2025-12-16T00:42:54.737Z",
//           reply: {
//             id: "2",
//             content: "스타일 작성자의 답글입니다. 감사합니다.",
//             createdAt: "2025-12-16T00:42:54.161Z",
//           },
//         },
//         {
//           id: "78",
//           styleId: "21",
//           nickname: "뷰어1",
//           content: "트렌디한 느낌이 살아있네요!ㅋㅋㅋ",
//           trendy: 9,
//           personality: 7,
//           practicality: 8,
//           costEffectiveness: 5,
//           createAt: "2025-12-16T00:42:54.647Z",
//           updateAt: "2025-12-16T00:42:54.647Z",
//           reply: {
//             id: "3",
//             content: "스타일 작성자의 답글입니다. 감사합니다.",
//             createdAt: "2025-12-16T00:42:54.161Z",
//           },
//         },
//         {
//           id: "77",
//           styleId: "21",
//           nickname: "뷰어1",
//           content: "트렌디한 느낌이 살아있네요!ㅋㅋㅋ",
//           trendy: 9,
//           personality: 7,
//           practicality: 8,
//           costEffectiveness: 5,
//           createAt: "2025-12-16T00:42:54.558Z",
//           updateAt: "2025-12-16T00:42:54.558Z",
//           reply: {
//             id: "4",
//             content: "스타일 작성자의 답글입니다. 감사합니다.",
//             createdAt: "2025-12-16T00:42:54.161Z",
//           },
//         },
//         {
//           id: "76",
//           styleId: "21",
//           nickname: "뷰어1",
//           content: "트렌디한 느낌이 살아있네요!ㅋㅋㅋ",
//           trendy: 9,
//           personality: 7,
//           practicality: 8,
//           costEffectiveness: 5,
//           createAt: "2025-12-16T00:42:54.465Z",
//           updateAt: "2025-12-16T00:42:54.465Z",
//           reply: {
//             id: "5",
//             content: "스타일 작성자의 답글입니다. 감사합니다.",
//             createdAt: "2025-12-16T00:42:54.161Z",
//           },
//         },
//         {
//           id: "75",
//           styleId: "21",
//           nickname: "뷰어1",
//           content: "트렌디한 느낌이 살아있네요!ㅋㅋㅋ",
//           trendy: 9,
//           personality: 7,
//           practicality: 8,
//           costEffectiveness: 5,
//           createAt: "2025-12-16T00:42:54.360Z",
//           updateAt: "2025-12-16T00:42:54.360Z",
//           reply: {
//             id: "6",
//             content: "스타일 작성자의 답글입니다. 감사합니다.",
//             createdAt: "2025-12-16T00:42:54.161Z",
//           },
//         },
//         {
//           id: "74",
//           styleId: "21",
//           nickname: "뷰어1",
//           content: "트렌디한 느낌이 살아있네요!ㅋㅋㅋ",
//           trendy: 9,
//           personality: 7,
//           practicality: 8,
//           costEffectiveness: 5,
//           createAt: "2025-12-16T00:42:54.249Z",
//           updateAt: "2025-12-16T00:42:54.249Z",
//           reply: {
//             id: "7",
//             content: "스타일 작성자의 답글입니다. 감사합니다.",
//             createdAt: "2025-12-16T00:42:54.161Z",
//           },
//         },
//         {
//           id: "73",
//           styleId: "21",
//           nickname: "뷰어1",
//           content: "트렌디한 느낌이 살아있네요!ㅋㅋㅋ",
//           trendy: 9,
//           personality: 7,
//           practicality: 8,
//           costEffectiveness: 5,
//           createAt: "2025-12-16T00:42:54.066Z",
//           updateAt: "2025-12-16T00:42:54.066Z",
//           reply: {
//             id: "8",
//             content: "스타일 작성자의 답글입니다. 감사합니다.",
//             createdAt: "2025-12-16T00:42:54.161Z",
//           },
//         },
//       ],
//     },
//     {
//       id: "22", // ID 변경됨
//       nickname: "스트릿몬2",
//       title: "2222데일리 감성 룩 완성",
//       content: "두 번째 아이템입니다. 캐주얼하고 편안하게 입은 스타일이에요.",
//       viewCount: 100,
//       curationCount: 5,
//       categories: {
//         top: {
//           name: "라운드넥 티셔츠",
//           brand: "Uniqlo",
//           price: 29000,
//         },
//         bottom: {
//           name: "코튼 치노 팬츠",
//           brand: "Massimo Dutti",
//           price: 89000,
//         },
//       },
//       tags: ["캐주얼", "심플"],
//       imageUrls: ["https://dummyimage.com/ffffff&text=look3"],
//       curations: [
//         {
//           id: "90",
//           styleId: "22",
//           nickname: "뷰어2",
//           content: "깔끔해요.",
//           trendy: 5,
//           personality: 8,
//           practicality: 9,
//           costEffectiveness: 8,
//           createAt: "2025-12-16T00:45:00.000Z",
//           updateAt: "2025-12-16T00:45:00.000Z",
//           reply: {
//             id: "9",
//             content: "스타일 작성자의 답글입니다. 감사합니다.",
//             createdAt: "2025-12-16T00:42:54.161Z",
//           },
//         },
//         {
//           id: "91",
//           styleId: "22",
//           nickname: "뷰어3",
//           content: "가격대비 좋아요.",
//           trendy: 6,
//           personality: 7,
//           practicality: 8,
//           costEffectiveness: 9,
//           createAt: "2025-12-16T00:46:00.000Z",
//           updateAt: "2025-12-16T00:46:00.000Z",
//           reply: {
//             id: "10",
//             content: "스타일 작성자의 답글입니다. 감사합니다.",
//             createdAt: "2025-12-16T00:42:54.161Z",
//           },
//         },
//       ],
//     },
//     {
//       id: "23",
//       nickname: "하이패션",
//       title: "3333고급스러운 포멀 룩",
//       content:
//         "세 번째 아이템입니다. 중요한 자리에 입고 나갈 수 있는 포멀한 스타일이에요.",
//       viewCount: 50,
//       curationCount: 20,
//       categories: {
//         top: {
//           name: "실크 블라우스",
//           brand: "Celine",
//           price: 1500000,
//         },
//         bottom: {
//           name: "울 스커트",
//           brand: "Celine",
//           price: 1200000,
//         },
//       },
//       tags: ["포멀", "럭셔리"],
//       imageUrls: ["https://dummyimage.com/ffffff&text=look4"],
//       curations: [],
//     },
//   ],
// };

export function validateTrendy(trendy) {
  if (isNaN(trendy)) {
    throw new BadRequestError("트렌디 점수가 유효하지 않습니다.");
  }
  if (trendy < 0 || trendy > 10) {
    throw new BadRequestError("트렌디 점수는 0에서 10 사이여야 합니다.");
  }
  if (!Number.isInteger(trendy)) {
    throw new BadRequestError("트렌디 점수는 정수여야 합니다.");
  }
}

export function validatePersonality(personality) {
  if (isNaN(personality)) {
    throw new BadRequestError("개성 점수가 유효하지 않습니다.");
  }
  if (personality < 0 || personality > 10) {
    throw new BadRequestError("개성 점수는 0에서 10 사이여야 합니다.");
  }
  if (!Number.isInteger(personality)) {
    throw new BadRequestError("개성 점수는 정수여야 합니다.");
  }
}
export function validatePracticality(practicality) {
  if (isNaN(practicality)) {
    throw new BadRequestError("실용성 점수가 유효하지 않습니다.");
  }
  if (practicality < 0 || practicality > 10) {
    throw new BadRequestError("실용성 점수는 0에서 10 사이여야 합니다.");
  }
  if (!Number.isInteger(practicality)) {
    throw new BadRequestError("실용성 점수는 정수여야 합니다.");
  }
}

export function validateCostEffectiveness(costEffectiveness) {
  if (isNaN(costEffectiveness)) {
    throw new BadRequestError("가성비 점수가 유효하지 않습니다.");
  }
  if (costEffectiveness < 0 || costEffectiveness > 10) {
    throw new BadRequestError("가성비 점수는 0에서 10 사이여야 합니다.");
  }
  if (!Number.isInteger(costEffectiveness)) {
    throw new BadRequestError("가성비 점수는 정수여야 합니다.");
  }
}

export function validateRankBy(rankBy) {
  const validRankByOptions = [
    "total",
    "trendy",
    "costEffectiveness",
    "personality",
    "practicality",
  ];

  if (!validRankByOptions.includes(rankBy)) {
    throw new BadRequestError("랭킹 기준이 유효하지 않습니다.");
  }
}

export function validateLimit(limit) {
  if (limit && isNaN(limit)) {
    throw new BadRequestError("페이지 크기 값이 유효하지 않습니다.");
  }
  if (limit <= 0) {
    throw new BadRequestError("페이지 크기 값은 0보다 커야 합니다.");
  }
  if (limit > 50) {
    throw new BadRequestError("페이지 크기 값은 최대 50이하이어야 합니다.");
  }
}
