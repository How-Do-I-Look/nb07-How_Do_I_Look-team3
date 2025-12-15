import { stylesRepository } from "./style.repository.js";
import { Stylelist } from "../../classes/style/styleread.js";
import { calculateTotalPages } from "../../utils/style/pagenation.utile.js";


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

  // Repository 호출
  const { styles, totalItemCount } = await stylesRepository.findStylesWithOffset({
    page,
    pageSize,
    sortBy,
    searchBy: searchField,
    keyword: keyword,
    tag: tag,
  });

  //전체 페이지 수 계산
    const totalPages = calculateTotalPages(totalItemCount, pageSize);
    const currentPage = page; // 요청받은 페이지가 현재 페이지

  const data = styles.map(style =>
    Stylelist.fromPrismaEntity(style)
  )
return { currentPage, totalPages, totalItemCount, data };
}
