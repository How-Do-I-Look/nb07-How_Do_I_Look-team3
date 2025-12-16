
import { Stylelist } from "../../classes/style/styleread.js";
import { getPagination } from "../../utils/style/pagenation.utile.js";
import { stylesRepository } from "./stylerepository.js";


// - 등록된 스타일 갤러리 목록을 조회할 수 있습니다.
export async function getGalleryStyles({
     page,
     pageSize,
     sortBy,
     searchBy,
     keyword,
     tag }) {


      //요청 필드명 -> db필드명
      let searchField = searchBy
      if( searchBy === 'nickname') {
        searchField = 'author';
      } else if ( searchBy === 'content') {
        searchField = 'description';
      }else if (searchBy === 'tag') {
        searchField = 'tags'
      }

  // Repository 호출 (totalItemCount: 전체개수 ) 조회
      const totalItemCount = await stylesRepository.countStyles({
      searchBy: searchField,
      keyword: keyword,
      tag: tag,
      });

  //페이지네이션 메타데이터 계산
  const { currentPage, totalPages, skip } = getPagination({
    totalItemCount,
    page,
    pageSize
});

    //Repository 호출  계산된 skip 값을 사용하여 실제 데이터를 조회
  const styles = await stylesRepository.findStylesWithOffset({
    skip, // (offset) 값
    take: pageSize, //(Limit)
    sortBy,
    searchBy: searchField,
    keyword: keyword,
    tag: tag,
  });
  const data = styles.map(style =>
    Stylelist.fromPrismaEntity(style)
  )
return { currentPage, totalPages, totalItemCount, data };
}
