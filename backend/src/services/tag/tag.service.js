import { prisma } from "../../utils/prisma.js";
import { Tag } from "../../classes/tag/tag.js";

export const getTags = async () => {
  const tags = await prisma.tag.findMany({
    orderBy: {
      styles: { // 스타일 수가 많은 순서대로 정렬
        _count: "desc",
      },
    },
    take: 10, // 상위 10개 태그만 조회
  });

  const tagObjects = tags.map((tag) => new Tag(tag).name);
  tagObjects.unshift("전체"); // 전체 태그를 맨 앞에 추가

  return { tags: tagObjects };
};