// 갤러리 목록 응답 전용 DTO
// 각 스타일의 대표 이미지, 제목, 닉네임, 태그, 스타일 구성, 스타일 설명, 조회수, 큐레이팅 수가 표시됩니다
export class StyleResponseDTO {
    constructor(id,thumbnail, nickname, title, tags, categories, content, viewCount,curationCount, createdAt, ranking, rating) {
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
        return new StyleResponseDTO(
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
}