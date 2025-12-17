import { Style } from "../../classes/style/style.js";
import { prisma } from "../../utils/prisma.js";
import {
  createContinuationToken,
  parseContinuationToken,
  buildCursorWhere,
  orderByToSort,
} from "../../utils/pagination.util.js";

//정렬 조건
function getPrismaOrderByClause({ sortBy }) {
  const orderBy = [];
  // 최신순 (latest)
  if (sortBy === "latest") {
    orderBy.push({ created_at: "desc" }, { id: "desc" });
  }
  // 조회순 (mostViewed)
  else if (sortBy === "mostViewed") {
    orderBy.push({ views: "desc" }, { id: "desc" });
  }
  // 큐레이팅순 (mostCurated)
  else if (sortBy === "mostCurated") {
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
    //닉네임 검색
    if (searchBy === "author" || searchBy === "all") {
      searchConditions.push({ author: containsKeyword });
    } //제목 검색
    if (searchBy === "title" || searchBy === "all") {
      searchConditions.push({ title: containsKeyword });
    } //상세 검색
    if (searchBy === "description" || searchBy === "all") {
      searchConditions.push({ description: containsKeyword });
    } //태그 검색
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
// - 등록된 스타일 갤러리 목록을 조회할 수 있습니다.
export async function getGalleryStyles({
  pageSize,
  sortBy = "latest",
  searchBy,
  keyword,
  tag,
  cursor,
}) {
  const take = parseInt(pageSize, 10) || 10;

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
  let totalItemCount = null;

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
  // 검색 개수 오류 우회를 위해 findMany().length 사용
  const countResult = await prisma.style.findMany({
    where: filterWhere,
    select: { id: true },
  });
  totalItemCount = countResult.length;

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
    totalItemCount: totalItemCount,
    data,
    cursor: {
      hasNextPage,
      nextCursor,
    },
  };
}
