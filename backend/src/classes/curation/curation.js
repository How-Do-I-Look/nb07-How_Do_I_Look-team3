import { BadRequestError } from "../../errors/errorHandler.js";
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
    createAt,
    updateAt,
    reply,
  }) {
    this.id = id;
    this.styleId = styleId;
    this.nickname = nickname;
    this.content = content;
    this.trendy = trendy;
    this.personality = personality;
    this.practicality = practicality;
    this.costEffectiveness = costEffectiveness;
    this.createAt = createAt;
    this.updateAt = updateAt;
    this.reply = reply;
  }

  static fromEntity(data) {
    return new Curation({
      id: data.id.toString(),
      styleId: data.style_id.toString(),
      nickname: data.nickname,
      content: data.content,
      trendy: data.trendy,
      personality: data.personality,
      practicality: data.practicality,
      costEffectiveness: data.costEffectiveness,
      createAt: data.created_at,
      updateAt: data.updated_at,
      reply: data.reply ? new Comment(data.reply) : null,
    });
  }
  static fromEntityList(entities) {
    if (!entities || !Array.isArray(entities)) return [];
    return entities.map((data) => Curation.fromEntity(data));
  }
}
