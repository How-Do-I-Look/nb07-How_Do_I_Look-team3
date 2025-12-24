import { BadRequestError } from "../../errors/errorHandler.js";
import { safeNumber } from "../../utils/number.util.js";

export class Pagenation {
  constructor({
    currentPage,
    totalPages,
    totalItemCount,
    data,
    lastElemCursor,
    hasNext,
  }) {
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    this.totalItemCount = totalItemCount;
    this.data = data;
    this.lastElemCursor = lastElemCursor;
    this.hasNext = hasNext;
  }

  static fromEntity(entity) {
    const { cursor, nextValue } = getNextCursorInfo(entity);

    return new Pagenation({
      currentPage: safeNumber(entity.currentPage, 1),
      totalPages: safeNumber(entity.totalPages, 1),
      totalItemCount: safeNumber(entity.totalItemCount),
      data: entity.data,
      lastElemCursor: cursor,
      hasNext: nextValue,
    });
  }
}
/**
 *
 * @param {Object} data 페이지 정보를 포함한 응답 데이터
 * @returns
 * @returns {{ cursor: string, hasNext: boolean }}
 * 다음 페이지 조회를 위한 커서와 다음 페이지 존재 여부
 */
function getNextCursorInfo(data) {
  const cursorExist = !!data?.cursor;

  return {
    cursor: cursorExist ? data?.cursor?.nextCursor : data?.lastElemCursor,
    nextValue: cursorExist ? !!data?.cursor?.hasNextPage : !!data?.hasNext,
  };
}

// 페이지 번호만 검사
export function validatePage(page) {
  if (page === undefined || page === null) return;
  const parsedPage = parseInt(page, 10);
  if (isNaN(parsedPage) || parsedPage < 1) {
    throw new BadRequestError("page는 1 이상의 숫자여야 합니다.");
  }
}
//페이지 크기(limit)만 검사
export function validateLimit(limit) {
  if (limit === undefined || limit === null) return;
  const parsedLimit = parseInt(limit, 10);
  if (isNaN(parsedLimit)) {
    throw new BadRequestError("limit는 숫자여야 합니다.");
  }
  if (parsedLimit <= 0 || parsedLimit > 30) {
    throw new BadRequestError("limit는 1에서 30 사이여야 합니다.");
  }
}
