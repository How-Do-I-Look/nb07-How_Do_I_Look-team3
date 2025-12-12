import { BadRequestError } from "../../errors/errorHandler.js";
import { StyleImage } from "./styleImage.js";
import { StyleItem } from "./styleItem.js";
import { StyleTag } from "./styleTag.js";

export class Style {
  constructor({
    id,
    title,
    nickname,
    content,
    viewCount,
    curationCount,
    createAt,
    categories,
    tags,
    imageUrls,
  }) {
    this.id = id;
    this.nickname = nickname;
    this.title = title;
    this.content = content;
    this.viewCount = viewCount;
    this.curationCount = curationCount;
    this.createAt = createAt;
    this.categories = categories;
    this.tags = tags;
    this.imageUrls = imageUrls;
  }


  static fromEntity(style) {
    const nickname = style.author || style.nickname;
    const content = style.content || style.description;
    validateRequiredField(style);
    return new Style({
      id: style.id.toString(),
      nickname,
      title: style.title,
      content,
      viewCount : style.views,
      curationCount : style.curation_count,
      createAt : style.create_at,
      categories : StyleItem.fromEntities(style.items),
      tags : StyleTag.fromEntities(style.tags),
      imageUrls : StyleImage.fromEntities(style.images),
    });
  }
}

export function validateRequiredField(data) {
  const nickname = data.author || data.nickname;
  const content = data.content || data.description;

  if (!data.title) throw new BadRequestError("필수 입력 값이 누락되었습니다. : title");
  if (!nickname) throw new BadRequestError("필수 입력 값이 누락되었습니다. : author");
  if (!content) throw new BadRequestError("필수 입력 값이 누락되었습니다. : description");
  if (!data.password) throw new BadRequestError("필수 입력 값이 누락되었습니다. : password");
}
