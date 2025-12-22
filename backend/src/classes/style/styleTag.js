export class StyleTag {
  constructor({ name }) {
    this.name = name;
  }
  static fromEntity(data) {
    return new StyleTag({
      name: data.name,
    });
  }
  static fromEntities(data) {
    if (!data) return [];
    return data
      .filter((entity) => entity.tag.name) // 안전장치
      .map((entity) => entity.tag.name);
  }
}
