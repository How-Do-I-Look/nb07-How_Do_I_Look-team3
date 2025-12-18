import { StyleCategory } from "../../../generated/prisma/index.js";
import { Curation } from "../../classes/curation/curation.js";
import { Style } from "../../classes/style/style.js";
import { ForbiddenError, NotFoundError } from "../../errors/errorHandler.js";
import {
  buildCursorWhere,
  createContinuationToken,
  orderByToSort,
  parseContinuationToken,
} from "../../utils/pagination.util.js";
import { defaultValue } from "../../utils/string.util.js";
import { prisma } from "../../utils/prisma.js";

const HOST_NAME = process.env.DEV_HOST_NAME || "http://localhost:3000";

/**
 * 새로운 스타일 생성
 * 스타일 정보, 연관된 이미지, 아이템, 태그를 같이 저장
 * @param {String} author - 작성자
 * @param {String} title - 제목
 * @param {String} description - 설명
 * @param {String} password - 비밀번호
 * @param {Object} items - 스타일 구성
 * @param {Array} tags - 스타일 태그
 * @param {Array} imageUrls - 스타일 이미지
 * @returns {Style} - newStyle - 스타일 반환
 */
export async function createStyle(
  nickname,
  title,
  content,
  password,
  items,
  tags,
  imageUrls,
) {
  const newStyle = await prisma.$transaction(async (tr) => {
    {
      const styles = await tr.style.create({
        data: {
          title,
          author: nickname,
          description: content,
          password,
        },
      });
      const styleId = styles.id;

      await tr.styleImage.createMany({
        data: parseStyleImageUrl(imageUrls, styleId),
      });

      await tr.styleItem.createMany({
        data: parseStyleItemKeys(items, styleId),
      });
      await upsertTags(tr, tags, styleId);

      const findStyle = await tr.style.findUnique({
        where: { id: styleId },
        include: {
          images: {
            orderBy: { order: "desc" },
          },
          items: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      const { author, description } = findStyle;
      const result = {
        ...findStyle,
        nickname: author,
        content: description,
      };
      return result;
    }
  });

  return Style.fromEntity(newStyle);
}

/**
 * 스타일 수정
 * 연관된 스타일 정보 제거 후 재 등록하는 방식으로 변경
 * @param {BigInt} styleId - 스타일 아이디
 * @param {String} title - 제목
 * @param {String} description - 설명
 * @param {String} password - 비밀번호
 * @param {Object} items - 스타일 구성
 * @param {Array} tags - 스타일 태그
 * @param {Array} imageUrls - 스타일 이미지
 * @returns {Style} - newStyle - 변경된 내용의 스타일 반환
 */
export async function updateStyle(
  styleId,
  title,
  content,
  password,
  items,
  tags,
  imageUrls,
) {
  const existStyle = await prisma.style.findUnique({
    where: { id: styleId },
  });
  if (!existStyle) {
    throw new NotFoundError("수정하려는 스타일이 없습니다.");
  }
  if (existStyle.password !== password) {
    throw new ForbiddenError("비밀번호가 틀렸습니다.");
  }
  const newStyle = await prisma.$transaction(async (tr) => {
    await tr.styleImage.deleteMany({ where: { style_id: styleId } });
    await tr.styleItem.deleteMany({ where: { style_id: styleId } });
    await tr.styleTag.deleteMany({ where: { style_id: styleId } });

    await tr.style.update({
      where: { id: styleId, password },
      data: {
        title,
        description: content,
      },
    });

    if (imageUrls) {
      await tr.styleImage.createMany({
        data: parseStyleImageUrl(imageUrls, styleId),
      });
    }

    if (items) {
      await tr.styleItem.createMany({
        data: parseStyleItemKeys(items, styleId),
      });
    }
    if (tags) {
      await upsertTags(tr, tags, styleId);
    }
    const findStyle = await tr.style.findUnique({
      where: { id: styleId },
      include: {
        images: {
          orderBy: { order: "desc" },
        },
        items: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    const { author, description } = findStyle;
    console.log(author, description);
    const result = {
      ...findStyle,
      nickname: author,
      content: description,
    };
    return result;
  });
  return Style.fromEntity(newStyle);
}

/**
 * 스타일 삭제
 * @param {BigInt} styleId - 스타일 아이디
 * @returns {Style} - 스타일 반환
 */
export async function deleteStyle(styleId, password) {
  const findStyle = await prisma.style.findUnique({
    where: {
      id: styleId,
    },
  });
  if (!findStyle) throw new NotFoundError("존재하지않습니다.");

  if (findStyle.password !== password) {
    throw new ForbiddenError("비밀번호가 틀렸습니다");
  }
  const deleteStyle = await prisma.style.delete({
    where: {
      id: styleId,
      password,
    },
  });
  return deleteStyle;
}

/**
 * 스타일 상세 조회
 * @param {BigInt} styleId
 * @returns {Style} - 스타일 상세 내용 반환
 */
export async function detailFindStyle(styleId, cursor, take) {
  const detailStyle = await prisma.style.findUnique({
    where: { id: BigInt(styleId) },

    include: {
      images: {
        orderBy: { order: "desc" },
      },
      items: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!detailStyle) {
    throw new NotFoundError("존재하지 않는 스타일입니다.");
  }

  const orderBy = [{ created_at: "desc" }, { id: "asc" }];
  const sort = orderByToSort(orderBy);
  const cursorToken = parseContinuationToken(cursor);

  const cursorWhere = cursorToken
    ? buildCursorWhere(cursorToken.data, cursorToken.sort)
    : {};
  const baseWhere = {
    style_id: BigInt(styleId),
  };
  const curationsWhere =
    Object.keys(cursorWhere).length > 0
      ? { AND: [baseWhere, cursorWhere] }
      : baseWhere;
  const entities = await prisma.curation.findMany({
    where: curationsWhere,
    orderBy,
    take: take + 1,
    include: {
      reply: true,
    },
  });

  const hasNext = entities.length > take;
  const items = hasNext ? entities.slice(0, take) : entities;

  const lastElemCursor =
    hasNext && items.length > 0
      ? createContinuationToken(
          {
            id: items[items.length - 1].id,
            created_at: items[items.length - 1].created_at,
          },
          sort,
        )
      : null;

  detailStyle.curations = Curation.fromEntityList(items);
  const result = {
    ...detailStyle,
    nickname: detailStyle.author,
    content: detailStyle.description,
  };
  return {
    data: Style.fromEntity(result),
    lastElemCursor: hasNext ? lastElemCursor : null,
    hasNext: hasNext,
  };
}

/**
 * 스타일 이미지 등록
 * 처리 후 등록된 이미지의 경로를 반환함
 * @param {String} uploadFile - 업로드 이미지 경로
 * @returns {String} - 이미지 경로 반환
 */
export function createStyleImage(uploadFile) {
  try {
    if (!uploadFile || uploadFile.length === 0) {
      // 파일을 찾을 수 없을 때 처리
      throw new NotFoundError("업로드된 이미지가 없습니다.");
    }
    const filePath = uploadFile.path.replace(/\\/g, "/");
    const imageUrl = `${HOST_NAME}/${filePath}`;
    return imageUrl;
  } catch (error) {
    throw new Error(error);
  }
}

function parseStyleItemKeys(items, styleId) {
  const itemKeys = Object.keys(items);
  const styleItemsData = itemKeys
    .filter((key) => {
      if (!items[key]) return false;
      if (isNaN(items[key].price)) return false;
      if (!items[key].name || !items[key].brand) return false;
      return true;
    })
    .map((key) => {
      return {
        style_id: styleId,
        item_name: items[key].name,
        brand_name: items[key].brand,
        price: items[key].price ?? 0,
        category: StyleCategory[key.toUpperCase()],
      };
    });
  return styleItemsData;
}

async function upsertTags(tr, tags, styleId) {
  await Promise.all(
    tags.map(async (tagName) => {
      const updatedTag = await tr.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      });
      await tr.styleTag.create({
        data: {
          style_id: styleId,
          tag_id: updatedTag.id,
        },
      });
    }),
  );
}
function parseStyleImageUrl(imageUrls, styleId) {
  const styleImageData = imageUrls.map((imageUrl, index) => {
    const lastIndex = imageUrl.lastIndexOf("/");
    const imageName = imageUrl.substring(lastIndex + 1);
    const imagePath = imageUrl.substring(0, lastIndex);
    return {
      style_id: styleId,
      name: imageName,
      path: imagePath,
      size: 50000, // 임시 값
      order: index + 1, // 순서 (1부터 시작)
    };
  });
  return styleImageData;
}

/**
 * 스타일 갤러리 목록 조회
 * @param {Object} query (limit, sortBy, searchBy, keyword, tag, cursor, page)
 * @returns {Object}  페이징 정보 및 가공된 스타일 목록 반환
 */

//정렬 조건
function getPrismaOrderByClause({ sortBy }) {
  const orderBy = [];

  if (sortBy === "latest") {
    orderBy.push({ created_at: "desc" }, { id: "desc" });
  } else if (sortBy === "mostViewed") {
    orderBy.push({ views: "desc" }, { id: "desc" });
  } else if (sortBy === "mostCurated") {
    orderBy.push({ curation_count: "desc" }, { id: "desc" });
  }
  return orderBy; // 정렬 조건 반환
}

// DB 쿼리에 사용할 필터링 조건 (WHERE)을 생성
function getPrismaWhereClause({ searchBy, keyword, tag }) {
  const whereConditions = {};

  // 태그 필터링 조건
  if (tag) {
    const tagsArray = tag.split(",").map((t) => t.trim());
    whereConditions.tags = {
      some: {
        tag: { name: { in: tagsArray } },
      },
    };
  }

  // 검색 조건
  if (keyword && searchBy) {
    const containsKeyword = { contains: keyword, mode: "insensitive" };
    const searchConditions = [];

    if (searchBy === "author" || searchBy === "all") {
      searchConditions.push({ author: containsKeyword });
    }
    if (searchBy === "title" || searchBy === "all") {
      searchConditions.push({ title: containsKeyword });
    }
    if (searchBy === "description" || searchBy === "all") {
      searchConditions.push({ description: containsKeyword });
    }
    if (searchBy === "tags" || searchBy === "all") {
      searchConditions.push({
        tags: {
          some: {
            tag: {
              name: containsKeyword,
            },
          },
        },
      });
    }
    if (searchConditions.length > 0) {
      whereConditions.AND = whereConditions.AND || [];
      whereConditions.AND.push({ OR: searchConditions });
    }
  }
  return whereConditions;
}

//메인 서비스 함수
export async function getGalleryStyles({
  limit,
  sortBy = "latest",
  searchBy,
  keyword,
  tag,
  cursor,
  page,
}) {
  const take = parseInt(defaultValue(limit, 16), 10);
  const currentPage = parseInt(defaultValue(page, 1), 10);

  //요청 필드명 -> db필드명
  let searchField = searchBy;
  if (searchBy === "nickname") {
    searchField = "author";
  } else if (searchBy === "content") {
    searchField = "description";
  } else if (searchBy === "tag") {
    searchField = "tags";
  }

  // 기본 필터링(검색/태그) 조건 생성
  const filterWhere = getPrismaWhereClause({
    searchBy: searchField,
    keyword: keyword,
    tag: tag,
  });

  //정렬 조건 생성
  const orderBy = getPrismaOrderByClause({ sortBy });
  if (orderBy.length === 0) {
    orderBy.push({ created_at: "desc" }, { id: "desc" });
  }

  //where 조건 생성
  const cursorToken = parseContinuationToken(cursor);
  let cursorWhere = {};

  if (cursorToken) {
    // Prisma orderBy 포맷을 유틸리티의 sort 포맷으로 변환
    const sortArray = orderByToSort(orderBy);

    // 커서 데이터를 기반으로 OR 조건 생성 (이전 페이지의 마지막 항목 이후를 찾음)
    cursorWhere = buildCursorWhere(cursorToken.data, sortArray);
    //디버깅용
    console.log("Cursor Where Clause:", cursorWhere);
  }
  //where 조건 병합 (검색/태그 필터와 커서 조건 병합)
  const finalWhere = {
    AND: [filterWhere, cursorWhere].filter(
      (cond) => Object.keys(cond).length > 0,
    ),
  };

  //전체 개수 조회
  const totalItemCount = await prisma.style.count({
    where: filterWhere,
  });

  const totalPages = take > 0 ? Math.ceil(totalItemCount / take) : 0;

  //실제 데이터 조회
  const styles = await prisma.style.findMany({
    take: take + 1,
    where: finalWhere,
    orderBy: orderBy,
    include: {
      images: { where: { order: 1 }, select: { path: true }, take: 1 },
      items: true,
      tags: { select: { tag: { select: { name: true } } } },
    },
  });
  //다음 페이지 존재 여부 확인 및 커서 생성
  const hasNextPage = styles.length > take;
  const items = hasNextPage ? styles.slice(0, take) : styles;

  let nextCursor = null;
  if (hasNextPage) {
    const lastItem = items[items.length - 1];
    // 마지막 아이템과 정렬 기준으로 다음 커서 토큰 생성
    nextCursor = createContinuationToken(lastItem, orderByToSort(orderBy));
  }
  const data = items.map((style) => Style.fromListEntity(style));
  return {
    currentPage,
    totalPages,
    totalItemCount,
    data,
    cursor: {
      hasNextPage,
      nextCursor,
    },
  };
}
