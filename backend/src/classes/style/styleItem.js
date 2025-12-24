import { BadRequestError } from "../../errors/errorHandler.js";

export class StyleItem {
  constructor({ name, brand, price }) {
    ((this.name = name), (this.brand = brand), (this.price = price));
  }
  static fromEntity(data) {
    return new StyleItem({
      name: data.item_name,
      brand: data.brand_name,
      price: data.price,
    });
  }
  static fromEntities(data) {
    if (!data) return {};
    const entities = data.reduce((items, entity) => {
      const key = entity.category.toLowerCase();

      if (!entity.item_name) {
        throw new BadRequestError("필수 입력 값이 누락되었습니다. : item_name");
      }
      if (!entity.brand_name) {
        throw new BadRequestError(
          "필수 입력 값이 누락되었습니다. : brand_name",
        );
      }
      if (!entity.price) {
        throw new BadRequestError("필수 입력 값이 누락되었습니다. : price");
      }
      items[key] = {
        name: entity.item_name,
        brand: entity.brand_name,
        price: entity.price,
      };
      return items;
    }, {});
    return entities;
  }
}
