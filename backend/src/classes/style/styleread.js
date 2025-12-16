//목록 전체조회, 랭킹조회
export class Stylelist {
    constructor(id,thumbnail, nickname, title, tags, categories, content, viewCount,curationCount, createdAt, ranking= null, rating= null) {
        this.id = id.toString();
        this.thumbnail = thumbnail;  //imageUrl
        this.nickname = nickname;  //autor
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

    static fromPrismaEntity(styleEntity, ranking =null, rating = null) {
        //태그 목록 변환
        const tagsList = styleEntity.tags.map(styleTag => styleTag.tag.name);
       //아이템(배열) 을 카테고리(객체)로 변환
        const categoryMap = {};
        if (styleEntity.items) {
            styleEntity.items.forEach(item => {
                const categoryKey = item.category.toLowerCase();
                categoryMap [categoryKey] = {
                    name: item.item_name,
                    brand: item.brand_name,
                    price: item.price
                };

            });
        }
        return new Stylelist(
            styleEntity.id,
            styleEntity.images?.[0]?.path, //대표 이미지
            styleEntity.author,
            styleEntity.title,
            tagsList,
            categoryMap,
            styleEntity.description,
            styleEntity.views,
            styleEntity.curation_count,
            styleEntity.created_at,
            ranking,
            rating

        );
    }
    //null 필드를 필터링합니다.
    toJSON() {
        const obj = {};
        for (const key in this) {
            // null 또는 undefined가 아닌 필드만 복사합니다.
            if (this[key] !== null && this[key] !== undefined) {
                obj[key] = this[key];
            }
        }
        return obj;
    }
}
