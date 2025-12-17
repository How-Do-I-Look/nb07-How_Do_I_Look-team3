import { removeNullFields } from "../../utils/object.util.js";
import { safeString } from "../../utils/stringUtils.js";
//목록 전체조회, 랭킹조회
export class Stylelist {
  constructor(
    id,
    thumbnail,
    nickname,
    title,
    tags,
    categories,
    content,
    viewCount,
    curationCount,
    createdAt,
    ranking = null,
    rating = null,
  ) {
    this.id = id.toString();
    this.thumbnail = thumbnail; //imageUrl
    this.nickname = nickname; //autor
    this.title = title;
    this.tags = tags;
    this.categories = categories; //items
    this.content = content; //description
    this.viewCount = viewCount; //views
    this.curationCount = curationCount;
    this.createdAt = createdAt;
    this.ranking = ranking;
    this.rating = rating;
  }

  static fromPrismaEntity(styleEntity, ranking = null, rating = null) {
    //태그 목록 변환
    const tagsList = styleEntity.tags.map((styleTag) => styleTag.tag.name);
    //아이템(배열) 을 카테고리(객체)로 변환
    const categoryMap = {};
    if (styleEntity.items) {
      styleEntity.items.forEach((item) => {
        const categoryKey = item.category.toLowerCase();
        categoryMap[categoryKey] = {
          name: safeString(item.item_name),
          brand: safeString(item.brand_name),
          price: item.price,
        };
      });
    }
    return new Stylelist(
      safeString(styleEntity.id), // id는 toString()으로 변환되므로, safeString으로 안전하게 처리
      safeString(styleEntity.images?.[0]?.path),
      safeString(styleEntity.author),
      safeString(styleEntity.title),
      tagsList,
      categoryMap,
      safeString(styleEntity.description),
      styleEntity.views,
      styleEntity.curation_count,
      styleEntity.created_at,
      ranking,
      rating,
    );
  }
  //null 속성 제거
  toJSON() {
    return removeNullFields(this);
  }
}
