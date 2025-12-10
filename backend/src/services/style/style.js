export class StyleComment {
  constructor(style) {
    this.style = style;
  }
}

export class UnregisteredStyle {
  // title, auther, created_at, updated_at, curation, tag를 조회합니다.
  // 외부에서 쓰지 못한다.
  constructor(description, password, views, curation_count, tags, items, images) {
    this.description = description;
    this.password = password;
    this.views = views;
    this.curation_count = curation_count;
    this.tags = tags;
    this.items = items;
    this.images = images;
  }

  static fromInfo({ description, password, views, curation_count, tags = [], items = [], images = [] }) {
    const info = {
        description,
        password,
        views,
        curation_count,
        tags,
        items,
        images,
    };
    validateUnregisteredStyleInfo();

    return new UnregisteredStyle(
        info.description,
        info.password,
        info.views,
        info.curation_count,
        info.tags,
        info.items,
        info.images
    );
  }
}

export class Style {
    constructor( title, author, description, password, created_at, updated_at, views, curation_count, tags, items, curations, images ) {
        this.title = title; 
        this.author = author;
        this.description = description;
        this.password = password;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.views = views;
        this.curation_count = curation_count;
        this.tags = tags;
        this.items = items;
        this.curations = curations;
        this.images = images;
    }
    static fromEntity({ id, name, StyleCategory, created_at, updated_at, tags = []}) {
    const info = {
        id: id.toString(),
        name,
        StyleCategory,
        createdAt: created_at,
        updatedAt: updated_at,
        tags,
    };
    console.log("info fromEntiry:", info);
    validateStyleInfo();

    return new Style(
      info.id,
      info.createdAt,
      info.name,
      info.price,
      info.tags,
      info.description
    );
  }
}

export class StyleCategory {
    static TOP = "상의";           
    static BOTTOM = "하의";     
    static OUTER = "아우터";       
    static ONEPIECE = "원피스"; 
    static SHOES = "신발";       
    static BAG = "가방";           
    static ACCESSORY = "액세서리"; 
}

export class StyleItem {
    constructor(id, style_id, item_name, brand_name, category, price, created_at, updated_at) {
        this.id = id;
        this.style_id = style_id;
        this.item_name = item_name;
        this.brand_name = brand_name;
        this.category = category;
        this.price = price;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}

export class StyleImage {
    constructor(id, style_id, name, path, size, order, created_at, updated_at) {
        this.id = id;
        this.style_id = style_id;
        this.name = name;
        this.path = path;
        this.size = size;
        this.order = order;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
function validateStyleInfo() {
  return;
}

function validateUnregisteredStyleInfo() {
  return;
}



