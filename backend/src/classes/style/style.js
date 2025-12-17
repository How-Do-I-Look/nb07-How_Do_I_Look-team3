import { BadRequestError } from "../../errors/errorHandler.js";
import { removeNullFields } from "../../utils/validate.util.js";
import { safeString } from "../../utils/string.util.js";
import { StyleImage } from "./styleImage.js";
import { StyleItem } from "./styleItem.js";
import { StyleTag } from "./styleTag.js";

export class Style {
  constructor({
    id,
    thumbnail,
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
    this.thumbnail = thumbnail;
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
  //갤러리 목록조회용
  static fromListEntity(styleEntity) {
    return new Style({
      id: styleEntity.id.toString(),
      thumbnail: safeString(styleEntity.images?.[0]?.path),
      nickname: safeString(styleEntity.author),
      title: safeString(styleEntity.title),
      tags: styleEntity.tags.map((t) => t.tag.name),
      categories: this.transformCategories(styleEntity.items),
      content: safeString(styleEntity.description),
      viewCount: styleEntity.views,
      curationCount: styleEntity.curation_count,
      createAt: styleEntity.created_at,
    });
  }

  // 카테고리 변환 로직
  static transformCategories(items) {
    const categoryMap = {};
    if (items) {
      items.forEach((item) => {
        const categoryKey = item.category.toLowerCase();
        categoryMap[categoryKey] = {
          name: safeString(item.item_name),
          brand: safeString(item.brand_name),
          price: item.price,
        };
      });
    }
    return categoryMap;
  }
  //null 속성 제거
  toJSON() {
    return removeNullFields(this);
  }
}

export function validateStyleId(styleId) {
  if (isNaN(styleId)) {
    throw new BadRequestError("스타일 ID는 숫자여야 합니다");
  }
  if (Number(styleId) <= 0) {
    throw new BadRequestError("스타일 ID는 0보다 커야 합니다.");
  }
  if (styleId === null || styleId === undefined) {
    throw new BadRequestError("스타일 ID는 필수 입력 값입니다.");
  }
}
export function validateNickname(nickname) {
  if (!nickname || nickname.trim().length === 0) {
    throw new BadRequestError("닉네임은 필수 입력 값입니다.");
  }
  if (typeof nickname !== "string") {
    throw new BadRequestError("닉네임은 문자열이어야 합니다.");
  }
  if (nickname.length > 30) {
    throw new BadRequestError("닉네임은 10자 이하여야 합니다.");
  }
  if (/[^a-zA-Z0-9가-힣_]/.test(nickname)) {
    throw new BadRequestError("닉네임은 특수문자를 포함할 수 없습니다.");
  }
}
export function validateTitle(title) {
  if (!title || title.trim().length === 0) {
    throw new BadRequestError("제목은 필수 입력 값입니다.");
  }
  if (typeof title !== "string") {
    throw new BadRequestError("제목은 문자열이어야 합니다.");
  }
  if (title.length > 100) {
    throw new BadRequestError("제목은 100자 이하여야 합니다.");
  }
}
export function validateContent(content) {
  if (!content || content.trim().length === 0) {
    throw new BadRequestError("설명은 필수 입력 값입니다.");
  }
  if (typeof content !== "string") {
    throw new BadRequestError("설명은 문자열이어야 합니다.");
  }
  if (content.length > 1000) {
    throw new BadRequestError("설명은 1000자 이하여야 합니다.");
  }
}

export function validatePassword(password) {
  if (!password || password.trim().length === 0) {
    throw new BadRequestError("비밀번호는 필수 입력 값입니다.");
  }
  if (typeof password !== "string") {
    throw new BadRequestError("비밀번호는 문자열이어야 합니다.");
  }
  if (password.length < 8 || password.length > 20) {
    throw new BadRequestError("비밀번호는 8자 이상 20자 이하이어야 합니다.");
  }
  if (/\s/.test(password)) {
    throw new BadRequestError("비밀번호는 공백을 포함할 수 없습니다.");
  }
  if (!/[A-Z]/.test(password)) {
    throw new BadRequestError(
      "비밀번호는 최소 하나의 대문자를 포함해야 합니다.",
    );
  }
  if (!/[a-z]/.test(password)) {
    throw new BadRequestError(
      "비밀번호는 최소 하나의 소문자를 포함해야 합니다.",
    );
  }
  if (!/[0-9]/.test(password)) {
    throw new BadRequestError("비밀번호는 최소 하나의 숫자를 포함해야 합니다.");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new BadRequestError(
      "비밀번호는 최소 하나의 특수문자를 포함해야 합니다.",
    );
  }
}

export function validateViewCount(viewCount) {
  if (isNaN(viewCount)) {
    throw new BadRequestError("조회수는 숫자여야 합니다.");
  }
  if (viewCount < 0) {
    throw new BadRequestError("조회수는 음수일 수 없습니다.");
  }
  if (!Number.isInteger(viewCount)) {
    throw new BadRequestError("조회수는 정수여야 합니다.");
  }
}

export function validateCurationCount(curationCount) {
  if (isNaN(curationCount)) {
    throw new BadRequestError("큐레이션 수는 숫자여야 합니다.");
  }
  if (curationCount < 0) {
    throw new BadRequestError("큐레이션 수는 음수일 수 없습니다.");
  }
  if (!Number.isInteger(curationCount)) {
    throw new BadRequestError("큐레이션 수는 정수여야 합니다.");
  }
}

export function validateCurations(curations) {
  if (!Array.isArray(curations)) {
    throw new BadRequestError("큐레이션은 배열이어야 합니다.");
  }
  if (curations.length === 0) {
    throw new BadRequestError("큐레이션은 최소 1개 이상이어야 합니다.");
  }
}

export function validateCategories(categories) {
  if (Object.keys(categories).length === 0) {
    throw new BadRequestError("카테고리는 필수 입력 값입니다.");
  }
}

export function validateTags(tags) {
  if (!Array.isArray(tags)) {
    throw new BadRequestError("태그는 배열이어야 합니다.");
  }
  if (tags.length === 0) {
    throw new BadRequestError("태그는 최소 1개 이상이어야 합니다.");
  }
  if (tags.length > 3) {
    throw new BadRequestError("태그는 최대 3개 이하이어야 합니다.");
  }
}

export function validateImageUrls(imageUrls) {
  if (!Array.isArray(imageUrls)) {
    throw new BadRequestError("이미지 URL은 배열이어야 합니다.");
  }
  if (imageUrls.length === 0) {
    throw new BadRequestError("이미지 URL은 최소 1개 이상이어야 합니다.");
  }
  if (imageUrls.length > 20) {
    throw new BadRequestError("이미지 URL은 최대 20개 이하이어야 합니다.");
  }
}

export function validateLimit(limit) {
  if (isNaN(limit)) {
    throw new BadRequestError("limit는 숫자여야 합니다.");
  }
  if (limit <= 0) {
    throw new BadRequestError("limit는 0보다 커야 합니다.");
  }
}
