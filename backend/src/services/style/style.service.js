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
import { safeNumber } from "../../utils/number.util.js";
import { prisma } from "../../utils/prisma.js";
import { Pagenation } from "../../classes/pagination/pagination.js";
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
 * 스타일 랭킹 조회
 * 스타일 전체 목록에서 랭킹 산출 후 정렬
 * @param {String} rankBy - 조회 기준(total, trendy 등.....)
 * @param {String} cursor - 페이징 처리 커서
 * @param {Number} take - 페이지 개수
 * @param {Number} page - 현재 페이지
 * @returns {Style[]} - 랭킹 적용 된 스타일 목록
 */
export async function listStyleRanking(rankBy, cursor, take, page) {
  const orderBy = [{ created_at: "desc" }, { id: "asc" }];
  const sort = orderByToSort(orderBy);
  //랭킹 계산을 위해 전체 목록 조회
  const entities = await prisma.style.findMany({
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
      curations: true,
    },
    orderBy,
  });


  const parsedEntities = entities.map(
  ({ images, author, description, ...entity }) => {
    // 이미지 객체 추출
    const image = images?.[0];

    // 이미지 정보가 있을 때만 경로 결합 및 정규식 처리, 없으면 더미
    const thumbnail = image?.path && image?.name
      ? `${image.path}/${image.name}`.replace(/([^:]\/)\/+/g, "$1")
      : '/public/images/style-dummy-image.jpg';
    console.log(thumbnail);
    return {
      ...entity,
      thumbnail,
      nickname: author,
      content: description,
    };
  }
);


  // 스타일 엔티티 적용
  const styles = {
    data: parsedEntities.map((style) => Style.fromEntity(style)),
  };
  // 스타일 목록에서 큐레이팅 점수를 기준으로 랭킹 계산
  const rankedData = calculateRating(styles, rankBy);
  // 전체 개수
  const totalStyleCount = rankedData.length;

  let startIndex = 0;

  const cursorToken = parseContinuationToken(cursor);
  if (cursorToken) {
    const targetId = String(cursorToken.data?.id);
    const foundIndex = rankedData.findIndex((item) => {
      return item.id === targetId;
    });
    // 찾은 항목 바로 다음부터 시작
    if (foundIndex !== -1) startIndex = foundIndex + 1;
  }

  const items = rankedData.slice(startIndex, startIndex + take);
  const hasNext = startIndex + items.length < totalStyleCount;

  //다음페이지 확인을 위한 커서 생성
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

  const parsedStyles = items.map(
    ({ content, imageUrls, curations, ...style }) => style,
  );

  //결과
  const result = {
    // 현재 페이지
    currentPage: page,
    // 전체 페이지 개수
    totalPages: Math.ceil(totalStyleCount / take),
    // 스타일 전체 개수
    totalItemCount: totalStyleCount,
    // 스타일 목록(랭킹 계산되어 있음)
    data: parsedStyles,
    // 커서
    lastElemCursor: hasNext ? lastElemCursor : null,
    // 다음 페이지 유무
    hasNext: hasNext,
  };

  return Pagenation.fromEntity(result);
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
      images: { where: { order: 1 }, select: { path: true, name : true }, take: 1 },
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
  const result = {
    currentPage: currentPage,
    totalPages: totalPages,
    totalItemCount: totalItemCount,
    data: data,
    lastElemCursor: hasNextPage ? nextCursor : null,
    hasNext: hasNextPage,
  };
  return Pagenation.fromEntity(result);
}

export function calculateRating(params, rankBy) {
  // 데이터가 없으면 빈 객체 반환
  if (!params || !params.data) return {};

  // 스타일마다 각각 큐레이팅 기준으로 평점 계산을 하기 위해 반복
  const styles = params.data
    .filter((style) => {
      //스타일에 큐레이팅이 없다면 제외
      return style.curations.length > 0;
    })
    .map((style) => {
      const curations = style.curations;
      const curationCount = curations.length;
      const totalScores = curations.reduce(
        (sums, curation) => {
          return {
            ...sums,
            trendy: safeNumber(sums.trendy) + safeNumber(curation.trendy),
            personality:
              safeNumber(sums.personality) + safeNumber(curation.personality),
            practicality:
              safeNumber(sums.practicality) + safeNumber(curation.practicality),
            costEffectiveness:
              safeNumber(sums.costEffectiveness) +
              safeNumber(curation.costEffectiveness),
          };
        },
        {
          // 초기값 설정
          trendy: 0,
          personality: 0,
          practicality: 0,
          costEffectiveness: 0,
        },
      );

      const averages = {
        trendy: safeNumber(totalScores.trendy) / curationCount,
        personality: safeNumber(totalScores.personality) / curationCount,
        practicality: safeNumber(totalScores.practicality) / curationCount,
        costEffectiveness:
          safeNumber(totalScores.costEffectiveness) / curationCount,
      };

      const totalAverage =
        (averages.trendy +
          averages.personality +
          averages.practicality +
          averages.costEffectiveness) /
        4;
      let average = 0;
      if (rankBy === "total") {
        average = safeNumber(totalAverage);
      } else {
        average =
          averages[rankBy] !== undefined
            ? safeNumber(averages[rankBy])
            : safeNumber(totalAverage);
      }
      const styleRating = Math.round(average * 10) / 10;

      return {
        ...style,
        ranking: null,
        rating: styleRating,
      };
    });
  const sorted = [...styles].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;

    return Number(b.id) - Number(a.id);
  });
  sorted.forEach((item, index) => {
    item.ranking = index + 1;
  });

  return sorted;
}
