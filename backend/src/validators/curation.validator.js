import { BadRequestError } from "../errors/errorHandler.js";

export class CurationValidator {
  // 숫자인지 체크
  static validateId(id) {
    if (!id || isNaN(id)) {
      throw new BadRequestError();
    }
  }

  //등록용 검증
  static validateCreate(body) {
    const {
      nickname,
      content,
      password,
      trendy,
      personality,
      practicality,
      costEffectiveness,
    } = body;

    if (!nickname || !content || !password) {
      throw new BadRequestError();
    }
    if (
      trendy === null ||
      personality === null ||
      practicality === null ||
      costEffectiveness === null
    ) {
      throw new BadRequestError();
    }
  }

  // 조회용 검증
  static validateList({ styleId, page, pageSize, searchBy, keyword }) {
    if (styleId === undefined) {
      throw new BadRequestError("styleId는 필수 입니다.");
    }

    if (isNaN(Number(styleId))) {
      throw new BadRequestError("styleId는 숫자여야 합니다.");
    }

    if (page !== undefined && isNaN(Number(page))) {
      throw new BadRequestError("page는 숫자여야 합니다.");
    }

    if (pageSize !== undefined && isNaN(Number(pageSize))) {
      throw new BadRequestError("pageSize는 숫자여야 합니다.");
    }

    if (searchBy !== undefined) {
      if (!["nickname", "content"].includes(searchBy)) {
        throw new BadRequestError("searchBy가 올바르지 않습니다.");
      }
    }
  }

  // 수정용 검증
  static validateUpdate(password) {
    if (!password) {
      throw new BadRequestError();
    }
  }
}
