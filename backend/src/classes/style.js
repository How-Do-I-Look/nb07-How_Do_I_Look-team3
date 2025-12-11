// 갤러리 목록 응답 전용 DTO
export class GalleryStyleDTO {
    constructor(id, title, author, imageUrl, views, tags, curationCount) {
        this.id = id.toString();
        this.title = title;
        this.author = author; 
        this.imageUrl = imageUrl;
        this.views = views;
        this.tags = tags;
        this.curationCount = curationCount;
    }

    static fromPrismaEntity(styleEntity) {
        const tagsList = styleEntity.tags.map(styleTag => styleTag.tag.name);
        return new GalleryStyleDTO(
            styleEntity.id,
            styleEntity.title,
            styleEntity.author, // 스키마에서 author를 직접 가져옴
            styleEntity.images?.[0]?.path, // 첫 번째 이미지의 path 사용
            styleEntity.views,
            tagsList,
            styleEntity.curation_count
        );
    }
}