
export class Style {
  constructor() {
    this.photos = photos; // 사진 여러장 가능
    this.tags = tags; // 최대 3개
    this.title = title;
    this.nickname = nickname;
    this.styleComponents = styleComponents; // 스타일 구성
    this.description = description; // 스타일 설명
    this.password = password;
  }
}
export class StyleComponent {
  constructor() {
    this.type = type; // 상의, 하의, 아우터, 원피스, 신발, 가방, 패션잡화
    this.clothingName = clothingName;
    this.brandName = brandName;
    this.price = price;
  }
}
export class Type {
    constructor() {
        this.top = '상의';
        this.bottom = '하의';
        this.outer = '아우터';
        this.dress = '원피스';
        this.shoes = '신발';
        this.bag = '가방';
        this.accessory = '패션잡화';
    }
}







