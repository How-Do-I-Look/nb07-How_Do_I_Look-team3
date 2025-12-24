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
