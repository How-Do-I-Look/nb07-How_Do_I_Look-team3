import { Tag } from "../../classes/tag/tag.js";
import { prisma } from "../../utils/prisma.js";

export const getTags = async () => {
  const tags = await prisma.tag.findMany({
    orderBy: {
      styles: {
        // 스타일 수가 많은 순서대로 정렬
        _count: "desc",
      },
    },
    take: 10, // 상위 10개 태그만 조회
  });

  const tagObjects = tags.map((tag) => new Tag(tag).name);

  return { tags: tagObjects };
};
