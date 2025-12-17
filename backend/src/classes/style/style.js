import { BadRequestError } from "../../errors/errorHandler.js";
import { safeString } from "../../utils/string.util.js";
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
    curations,
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
    this.curations = curations;
  }

  static fromEntity(style) {
    //const nickname = style.author || style.nickname;
    //const content = style.content || style.description;
    return new Style({
      id: safeString(style.id.toString()),
      nickname: safeString(style.nickname),
      title: style.title,
      content: safeString(style.content),
      viewCount: style.views,
      curationCount: style.curation_count,
      createAt: style.create_at,
      categories: StyleItem.fromEntities(style.items),
      tags: StyleTag.fromEntities(style.tags),
      imageUrls: StyleImage.fromEntities(style.images),
      curations: style.curations,
    });
  }
}

export function validateRequiredField(data, method) {
  if (method === "PUT") {
    validatePutRequiredField(data);
  } else if (method === "POST") {
    validatePostRequiredField(data);
  } else if (method === "DELETE") {
    validateDeleteRequiredField(data);
  } else if (method === "GET") {
    validateGetRequiredField(data);
    return;
  } else {
    throw new BadRequestError("유효하지 않은 요청입니다.");
  }
}

function validatePostRequiredField(data) {
  const { nickname, title, content, password, categories, tags, imageUrls } =
    data;
  if (!nickname)
    throw new BadRequestError("필수 입력 값이 누락되었습니다. : nickname");
  if (!title)
    throw new BadRequestError("필수 입력 값이 누락되었습니다. : title");
  if (!content)
    throw new BadRequestError("필수 입력 값이 누락되었습니다. : content");
  if (!password)
    throw new BadRequestError("필수 입력 값이 누락되었습니다. : password");
  if (!categories)
    throw new BadRequestError("필수 입력 값이 누락되었습니다. : categories");
  if (!tags) throw new BadRequestError("필수 입력 값이 누락되었습니다. : tags");
  if (!imageUrls)
    throw new BadRequestError("필수 입력 값이 누락되었습니다. : imageUrls");
}
function validateDeleteRequiredField(data) {
  const { styleId, password } = data;
  if (!styleId) {
    throw new BadRequestError("필수 입력 값이 누락되었습니다. : styleId");
  }
  if (isNaN(styleId)) {
    throw new BadRequestError("styleId는 숫자여야 합니다.");
  }
  if (!password) {
    throw new BadRequestError("필수 입력 값이 누락되었습니다. : password");
  }
  if (typeof password !== "string" || password.trim().length === 0) {
    throw new BadRequestError("유효하지 않은 값입니다. : password");
  }
}
function validateGetRequiredField(data) {
  const { styleId, take } = data;
  if (!styleId) {
    throw new BadRequestError("필수 입력 값이 누락되었습니다. : styleId");
  }
  if (isNaN(styleId)) {
    throw new BadRequestError("styleId는 숫자여야 합니다.");
  }
  if (styleId <= 0) {
    throw new BadRequestError("styleId는 0보다 커야 합니다.");
  }
  if (isNaN(take) || take <= 0) {
    throw new BadRequestError("유효하지 않은 limit 값입니다.");
  }
}

function validatePutRequiredField(data) {
  const { title, content, password, categories, tags, imageUrls } = data;
  if (!title)
    throw new BadRequestError("필수 입력 값이 누락되었습니다. : title");
  if (!content)
    throw new BadRequestError("필수 입력 값이 누락되었습니다. : content");
  if (!password)
    throw new BadRequestError("필수 입력 값이 누락되었습니다. : password");
  if (!categories)
    throw new BadRequestError("필수 입력 값이 누락되었습니다. : categories");
  if (!tags) throw new BadRequestError("필수 입력 값이 누락되었습니다. : tags");
  if (!imageUrls)
    throw new BadRequestError("필수 입력 값이 누락되었습니다. : imageUrls");
}
