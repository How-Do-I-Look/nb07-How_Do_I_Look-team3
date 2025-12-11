// - 등록된 스타일 목록을 조회할 수 있습니다.
// - 각 스타일의 대표 이미지, 제목, 닉네임, 태그, 스타일 구성, 스타일 설명, 조회수, 큐레이팅 수가 표시됩니다.
// - 갤러리 상단에 인기 태그가 표시됩니다. 해당 태그를 클릭하면 그 태그에 해당하는 스타일 목록이 표시됩니다.


import { stylesRepository } from "./style.repository";
import { GalleryStyleDTO } from "../classes/style.js";
import { calculateTotalPages } from "../../utils/style/pagenation.util.js";

export async function getGalleryStyles({ 
     page,
     pageSize, 
     sortBy, 
     searchBy, 
     keyword, 
     tag }) {

  // Repository 호출
  const { styles, totalItemCount } = await stylesRepository.findStylesWithOffset({
    page,
    pageSize,
    sortBy,
    searchBy,
    keyword,
    tag,
  });

  //전체 페이지 수 계산 (Offset 방식의 핵심 응답)
    const totalPages = calculateTotalPages(totalItemCount, pageSize);
    const currentPage = page; // 요청받은 페이지가 현재 페이지

  const data = styles.map(style =>
    GalleryStyleDTO.fromPrismaEntity(style)
  )
return { currentPage, totalPages, totalItemCount, data }; 
}


 // - 전체, 트렌디, 개성, 실용성, 가성비 기준으로 스타일 랭킹 목록을 조회할 수 있습니다.
 // - 각 스타일의 대표 이미지, 제목, 닉네임, 태그, 스타일 구성, 조회수, 큐레이팅수가 표시됩니다.
// - 페이지네이션이 가능합니다.
//     **Parameters**
// - `page` : number (현재 페이지 번호)
// - `pageSize` : number (페이지당 아이템 수)
// - `rankBy` : total | trendy | personality | practicality, costEffectiveness (랭킹 기준)


// **스타일 상세 조회**
// - 갤러리, 랭킹에서 스타일을 클릭할 경우 스타일 상세 조회가 가능합니다.
// - 이미지(여러장 가능), 제목, 닉네임, 태그, 스타일 구성, 스타일 설명, 조회수, 큐레이팅수가 표시됩니다.
// - 해당 스타일의 큐레이팅 목록이 표시됩니다.
// export function getstyleId(req, res, next) {
//      try {
//         const { id } = req.params;
//         const styleId = parseInt(id, 10);
//   } catch (error) {
//     next(error);
//   }
// }






// //프론트엔드 코드
// export const getGalleryStyles = async (
//   params: GalleryStylesSearchParams,
// ): Promise<PaginationResponse<GalleryStyle>> => {
//   const urlParams = new URLSearchParams()
//   urlParams.set('sortBy', params.sortBy)
//   urlParams.set('searchBy', params.searchBy)
//   urlParams.set('keyword', params.keyword)
//   urlParams.set('tag', params.tag)
//   urlParams.set('page', params.page?.toString() ?? '1')
//   urlParams.set('pageSize', GALLERY_STYLES_PAGE_SIZE.toString())
//   const query = urlParams.toString()

//   const response = await fetch(`${BASE_URL}/styles?${query}`, {
//     next: { tags: ['galleryStyles'] },
//   })
//   const { currentPage, totalPages, totalItemCount, data } =
//     await response.json()
//   return { currentPage, totalPages, totalItemCount, data }
// }

// export const getGalleryTags = async () => {
//   const response = await fetch(`${BASE_URL}/tags`, {
//     next: { tags: ['galleryTags'] },
//   })
//   const { tags } = await response.json()
//   return { tags }
// }

// export const getRankingStyles = async (
//   params: RankingStylesSearchParams,
// ): Promise<PaginationResponse<RankingStyle>> => {
//   const urlParams = new URLSearchParams()
//   urlParams.set('rankBy', params.rankBy)
//   urlParams.set('page', params.page.toString())
//   urlParams.set('pageSize', RANKING_STYLES_PAGE_SIZE.toString())
//   const query = urlParams.toString()

//   const response = await fetch(`${BASE_URL}/ranking?${query}`, {
//     next: { tags: ['rankingStyles'] },
//   })
//   const { currentPage, totalPages, totalItemCount, data } =
//     await response.json()
//   return { currentPage, totalPages, totalItemCount, data }
// }


// export const getStyle = async (styleId: number): Promise<StyleDetail> => {
//   const response = await fetch(`${BASE_URL}/styles/${styleId}`)
//   const style = await response.json()
//   return style
// }