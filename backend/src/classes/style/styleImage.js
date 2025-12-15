import { BadRequestError } from "../../errors/errorHandler.js";

export class StyleImage {
  constructor({name}) {
    this.name = name
  }
  static fromEntity(data) {

    return new StyleImage({
      name : data.imageUrl
    })
  }
  static fromEntities(data) {
    if(!data) return [];
    return data
    .sort((a, b) => a.order - b.order)
    .map(entity => {
      if(!entity.name) {
        throw new BadRequestError('필수 입력 값이 누락되었습니다. : image_name');
      }
      if(!entity.path) {
        throw new BadRequestError('필수 입력 값이 누락되었습니다. : image_path');
      }
      return `${entity.path}/${entity.name}`;
    });
  }
}
