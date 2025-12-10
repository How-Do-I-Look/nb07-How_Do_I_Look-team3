// - 등록된 스타일 목록을 조회할 수 있습니다.
// - 각 스타일의 대표 이미지, 제목, 닉네임, 태그, 스타일 구성, 스타일 설명, 조회수, 큐레이팅 수가 표시됩니다.
// - 갤러리 상단에 인기 태그가 표시됩니다. 해당 태그를 클릭하면 그 태그에 해당하는 스타일 목록이 표시됩니다.
// - 페이지네이션이 가능합니다.
// - 최신순, 조회순, 큐레이팅순(큐레이팅 많은 순)으로 정렬 가능합니다.
// - 닉네임, 제목, 상세, 태그로 검색이 가능합니다.
// - `page` : number (현재 페이지 번호)
// - `pageSize` : number (페이지당 아이템 수)
// - `sortBy` : latest | mostViewed | mostCurated (정렬 기준)
// - `searchBy` : nickname | title | content | tag (검색 기준)
// - `keyword` : string (검색어)
// - `tag` : string (태그)
export async function getGalleryStyles({ cursor,
     pageSize, 
     sortBy, 
     searchBy, 
     keyword, 
     tag }) {

  //입력된 cursor 문자열을 데이터베이스 쿼리에 사용할 수 있는 객체 형태로 변환
  const { cursorViews, cursorId } = parseCursor(cursor, sortBy);

  // Repository 호출
  const styles = await stylesRepository.findStylesWithCursor({
    pageSize,
    sortBy,
    searchBy,
    keyword,
    tag,
    cursorViews,
    cursorId,
  });

  // 응답 구조화 및 다음 커서 계산
  const hasNext = styles.length > pageSize; //pageSize 16 으로 돼있음 16보다 크면 다음페이지 존재
  const resultStyles = styles.slice(0, pageSize);
  const nextCursor = generateNextCursor(resultStyles, pageSize, sortBy);
  
  // DTO 형태로 최종 응답 ( 최종적으로 프론트엔드에게 목록 데이터,다음 커서값,다음 페이지 존재여부 객체 형태로 반환)
return {
    styles: resultStyles.map(/* DTO 매핑 로직*/),
    nextCursor,
    hasNext,
  }; 
}

- 
 // - 전체, 트렌디, 개성, 실용성, 가성비 기준으로 스타일 랭킹 목록을 조회할 수 있습니다.
 // - 각 스타일의 대표 이미지, 제목, 닉네임, 태그, 스타일 구성, 조회수, 큐레이팅수가 표시됩니다.
// - 페이지네이션이 가능합니다.
//     **Parameters**
// - `page` : number (현재 페이지 번호)
// - `pageSize` : number (페이지당 아이템 수)
// - `rankBy` : total | trendy | personality | practicality, costEffectiveness (랭킹 기준)

// 랭킹 기준에 따른 주 정렬 필드 매핑
 const RANKING_FIELDS_MAP = {
    total: 'total_score',
    trendy: 'views', // views가 주 랭킹 점수 역할
    personality: 'curation_count',
    practicality: 'curation_count',
    costEffectiveness: 'cost_score',
};

export async function getRankingStyles({ cursor, pageSize, rankBy }) {
    
    // 1. 랭킹 기준에 해당하는 주 점수 필드를 결정합니다.
    const scoreField = RANKING_FIELDS_MAP[rankBy];
    if (!scoreField) {
        throw new Error('유효하지 않은 랭킹 기준입니다.');
    }

    // 2. ✨ 커서 파싱 (복합 커서 로직 재사용)
    // 랭킹은 항상 복합 커서 형태라고 가정하고 파싱합니다.
    const { cursorViews: cursorScore, cursorId } = parseCursor(cursor, 'mostViewed'); // parseCursor 재사용

    // 3. Repository 호출
    const styles = await stylesRepository.findRankingStyles({
        pageSize,
        rankBy, // 랭킹 타입
        scoreField, // 정렬 기준 필드
        cursorScore, // 커서 점수
        cursorId, // 커서 ID
    });

    // 4. 응답 구조화 및 다음 커서 계산
    const hasNext = styles.length > pageSize;
    const resultStyles = styles.slice(0, pageSize);
    let nextCursor = null;

    if (hasNext) {
        const lastItem = resultStyles[resultStyles.length - 1];
        // 복합 커서 생성: '점수_ID'
        const scoreValue = lastItem[scoreField]; // 뷰, 큐레이팅, 혹은 계산된 점수 필드
        nextCursor = `${scoreValue}_${lastItem.styleId}`; 
    }

    // 5. DTO 형태로 최종 응답
    return {
        // ... (DTO 매핑 로직)
        styles: resultStyles.map(/* ... */),
        nextCursor,
        hasNext,
    };
}

// **스타일 상세 조회**

// - 갤러리, 랭킹에서 스타일을 클릭할 경우 스타일 상세 조회가 가능합니다.
// - 이미지(여러장 가능), 제목, 닉네임, 태그, 스타일 구성, 스타일 설명, 조회수, 큐레이팅수가 표시됩니다.
// - 해당 스타일의 큐레이팅 목록이 표시됩니다.
export function getstyleId(req, res, next) {
     try {
        const { id } = req.params;
        const styleId = parseInt(id, 10);
  } catch (error) {
    next(error);
  }
}




//페이지네이션 정렬
//검색


export const getGalleryStyles = async (
  params: GalleryStylesSearchParams,
): Promise<PaginationResponse<GalleryStyle>> => {
  const urlParams = new URLSearchParams()
  urlParams.set('sortBy', params.sortBy)
  urlParams.set('searchBy', params.searchBy)
  urlParams.set('keyword', params.keyword)
  urlParams.set('tag', params.tag)
  urlParams.set('page', params.page?.toString() ?? '1')
  urlParams.set('pageSize', GALLERY_STYLES_PAGE_SIZE.toString())
  const query = urlParams.toString()

  const response = await fetch(`${BASE_URL}/styles?${query}`, {
    next: { tags: ['galleryStyles'] },
  })
  const { currentPage, totalPages, totalItemCount, data } =
    await response.json()
  return { currentPage, totalPages, totalItemCount, data }
}

export const getGalleryTags = async () => {
  const response = await fetch(`${BASE_URL}/tags`, {
    next: { tags: ['galleryTags'] },
  })
  const { tags } = await response.json()
  return { tags }
}

export const getRankingStyles = async (
  params: RankingStylesSearchParams,
): Promise<PaginationResponse<RankingStyle>> => {
  const urlParams = new URLSearchParams()
  urlParams.set('rankBy', params.rankBy)
  urlParams.set('page', params.page.toString())
  urlParams.set('pageSize', RANKING_STYLES_PAGE_SIZE.toString())
  const query = urlParams.toString()

  const response = await fetch(`${BASE_URL}/ranking?${query}`, {
    next: { tags: ['rankingStyles'] },
  })
  const { currentPage, totalPages, totalItemCount, data } =
    await response.json()
  return { currentPage, totalPages, totalItemCount, data }
}


export const getStyle = async (styleId: number): Promise<StyleDetail> => {
  const response = await fetch(`${BASE_URL}/styles/${styleId}`)
  const style = await response.json()
  return style
}