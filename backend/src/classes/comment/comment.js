import { BadRequestError } from "../../errors/errorHandler.js";

export class Comment {
  constructor(reply) {
    this.id = BigInt(reply.id);
    this.nickname = reply.nickname;
    this.content = reply.content;
    this.createdAt = reply.created_at;
  }

  static validateId(id) {
    if (isNaN(id)) {
      throw new BadRequestError("ID는 숫자여야 합니다");
    }
  }

  static validateContent(content) {
    if (!content) {
      throw new BadRequestError("내용을 입력해주세요");
    }
  }

  static validatePassword(password) {
    if (!password) {
      throw new BadRequestError("비밀번호를 입력해주세요");
    }
  }
}
