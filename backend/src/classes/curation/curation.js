import { BadRequestError } from "../../errors/errorHandler.js";
import { safeString } from "../../utils/string.util.js";
import { Comment } from "../comment/comment.js";

export class Curation {
  constructor({
    id,
    styleId,
    nickname,
    content,
    trendy,
    personality,
    practicality,
    costEffectiveness,
    createdAt,
    updatedAt,
    comment,
  }) {
    this.id = id;
    this.styleId = styleId;
    this.nickname = nickname;
    this.content = content;
    this.trendy = trendy;
    this.personality = personality;
    this.practicality = practicality;
    this.costEffectiveness = costEffectiveness;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.comment = comment;
  }

  static fromEntity(data) {
    const id = safeString(data.id);
    const styleId = safeString(data.style_id ?? data.styleId);
    validationParameter(data);
    return new Curation({
      id: id,
      styleId: styleId,
      nickname: data.nickname,
      content: data.content,
      trendy: data.trendy,
      personality: data.personality,
      practicality: data.practicality,
      costEffectiveness: data.costEffectiveness,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      comment: data.reply ? new Comment(data.reply) : null,
    });
  }
  static fromEntityList(entities) {
    if (!entities || !Array.isArray(entities)) return [];
    return entities.map((data) => Curation.fromEntity(data));
  }
}

function validationParameter(data) {
  if (data === null || data === undefined) {
    throw new BadRequestError("필수 입력 값이 누락되었습니다.");
  }
  if (!data.id) throw new BadRequestError("큐레이션 ID가 유효하지 않습니다.");
  // if (!data.style_id)
    // throw new BadRequestError("스타일 ID가 유효하지 않습니다.");
  if (!data.nickname) throw new BadRequestError("닉네임이 유효하지 않습니다.");
  if (!data.content) throw new BadRequestError("내용이 유효하지 않습니다.");
  if (data.trendy === null || data.trendy === undefined)
    throw new BadRequestError("트렌디 점수가 유효하지 않습니다.");
  if (data.personality === null || data.personality === undefined)
    throw new BadRequestError("개성 점수가 유효하지 않습니다.");
  if (data.practicality === null || data.practicality === undefined)
    throw new BadRequestError("실용성 점수가 유효하지 않습니다.");
  if (data.costEffectiveness === null || data.costEffectiveness === undefined)
    throw new BadRequestError("가성비 점수가 유효하지 않습니다.");
}
