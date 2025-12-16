
import { Stylelist } from "../../classes/style/styleread.js";
import { calculateTotalPages, getPaginationMetadata } from "../../utils/style/pagenation.utile.js";
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

      // WHERE 조건 생성 (Repository 위임)
    const whereConditions = stylesRepository.getPrismaWhereClause({
        searchBy: searchField,
        keyword: keyword,
        tag: tag,
        });

        //전체 개수 조회
    const totalItemCount = await stylesRepository.countStyles(whereConditions);

     //페이지네이션 메타데이터 계산
    const { currentPage, totalPages, skip } = getPaginationMetadata({
        totalItemCount,
        page,
        pageSize
    });

    //실제 데이터 조회
    const styles = await stylesRepository.findStylesWithOffset({
        skip,
        take: pageSize,
        sortBy,
        where: whereConditions,
    });

  const data = styles.map(style =>
    Stylelist.fromPrismaEntity(style)
  )
return { currentPage, totalPages, totalItemCount, data };
}


// - 등록된 스타일 랭킹 목록을 조회할 수 있습니다.
// - `rankBy` : total | trendy | personality | practicality, costEffectiveness (랭킹 기준)
