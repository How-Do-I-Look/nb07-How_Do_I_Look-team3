import { StyleCategory } from "./generated/prisma/index.js";
import { prisma } from "./src/utils/prisma.js";

const DEFAULT_PASSWORD = "123";

const DEFAULT_IMAGE_PATH = "./public/images/001.jpg";

// 시드 데이터 정의
const initialTags = [
  "데일리룩",
  "캐주얼",
  "힙스터",
  "미니멀",
  "스트릿",
  "가성비",
];
const styleData = [
  {
    title: "미니멀리스트의 가을 아우터 코디",
    author: "패피_K",
    description: "깔끔한 트렌치코트를 활용한 가을 일상복 스타일",
    tags: ["데일리룩", "미니멀", "가성비"],
    password: DEFAULT_PASSWORD, // 123
    items: [
      {
        name: "오버핏 트렌치코트",
        brand: "Minimalist",
        category: StyleCategory.OUTER,
        price: 150000,
      },
      {
        name: "와이드 슬랙스",
        brand: "ZARA",
        category: StyleCategory.BOTTOM,
        price: 60000,
      },
    ],
  },
  {
    title: "힙한 스트릿 패션의 정석",
    author: "스트릿몬",
    description: "강렬한 컬러와 오버핏의 조화",
    tags: ["힙스터", "스트릿", "데일리룩"],
    password: DEFAULT_PASSWORD, // 123
    items: [
      {
        name: "그래픽 후드티",
        brand: "Supreme",
        category: StyleCategory.TOP,
        price: 90000,
      },
      {
        name: "카고 팬츠",
        brand: "Musinsa",
        category: StyleCategory.BOTTOM,
        price: 75000,
      },
      {
        name: "에어 포스",
        brand: "Nike",
        category: StyleCategory.SHOES,
        price: 130000,
      },
    ],
  },
];

const curationReviews = [
  {
    nickname: "뷰어1",
    content: "트렌디한 느낌이 살아있네요!ㅋㅋㅋ",
    trendy: 9,
    personality: 7,
    practicality: 8,
    costEffectiveness: 5,
    password: DEFAULT_PASSWORD,
  },
  {
    nickname: "뷰어2",
    content: "개성이 강해서 좋아요ㅎㅎㅎ.",
    trendy: 8,
    personality: 9,
    practicality: 6,
    costEffectiveness: 8,
    password: DEFAULT_PASSWORD,
  },
];

async function main() {
  console.log("--- 시딩 시작 ---");

  // Tag Upsert (중복 제거)
  const uniqueTags = Array.from(
    new Set(initialTags.concat(styleData.flatMap((s) => s.tags))),
  );
  for (const tagName of uniqueTags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    });
  }
  console.log(`${uniqueTags.length}개 태그 저장 완료.`);
  const allTags = await prisma.tag.findMany();

  // Style 모델 및 관련 시드 데이터 생성
  for (const style of styleData) {
    // 비밀번호 (DEFAULT_PASSWORD)
    const stylePassword = style.password;

    // Style 생성
    const newStyle = await prisma.style.create({
      data: {
        title: style.title,
        author: style.author,
        description: style.description,
        password: stylePassword,
      },
    });

    console.log(`"${newStyle.title}" 스타일 생성 완료.`);

    // 스타일 구성 생성
    await prisma.styleItem.createMany({
      data: style.items.map((item) => ({
        style_id: newStyle.id,
        item_name: item.name,
        brand_name: item.brand,
        category: item.category,
        price: item.price,
      })),
    });

    // 스타일 태그 생성
    const tagsToConnect = style.tags.map((tagName) => {
      const tag = allTags.find((t) => t.name === tagName);
      if (!tag) throw new Error(`Tag Not Found: ${tagName}`);
      return {
        style_id: newStyle.id,
        tag_id: tag.id,
      };
    });
    await prisma.styleTag.createMany({
      data: tagsToConnect,
      skipDuplicates: true,
    });

    // 큐레이팅 생성 및 스타일 업데이트
    const curationCount = curationReviews.length;

    for (let i = 0; i < curationReviews.length; i++) {
      const review = curationReviews[i];

      const newCuration = await prisma.curation.create({
        data: {
          style_id: newStyle.id,
          nickname: review.nickname,
          content: review.content,
          password: DEFAULT_PASSWORD,
          trendy: review.trendy,
          personality: review.personality,
          practicality: review.practicality,
          costEffectiveness: review.costEffectiveness,
        },
      });

      // 첫 번째 큐레이팅에만 답글 추가
      // 큐레이팅에는 하나의 답글만 가능
      if (i === 0) {
        await prisma.reply.create({
          data: {
            curation_id: newCuration.id,
            content: "스타일 작성자의 답글입니다. 감사합니다.",
            password: DEFAULT_PASSWORD, // 123
            nickname: newStyle.author,
          },
        });
      }
    }

    // 스타일 큐레이팅 카운트 업데이트
    await prisma.style.update({
      where: { id: newStyle.id },
      data: {
        curation_count: curationCount,
      },
    });

    // 스타일 이미지 생성 (더미데이터로 통일된 내용 사용)
    await prisma.styleImage.create({
      data: {
        style_id: newStyle.id,
        name: "style_image_" + newStyle.id + ".jpg",
        path: DEFAULT_IMAGE_PATH, // public/images/001.jpg
        size: 512, // 임의 값
        order: 1,
      },
    });
  }

  console.log(` 모든 스타일에 이미지 생성 완료.`);
  console.log("--- 시딩 완료 ---");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
