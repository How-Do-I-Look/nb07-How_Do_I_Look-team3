import { stylesRepository } from "./style.repository.js";
import { calculateTotalPages } from "../../utils/style/pagenation.util.js";
import { StyleResponseDTO } from "../../classes/style/styleread.js"

// - 등록된 스타일 갤러리 목록을 조회할 수 있습니다.
export async function getGalleryStyles({ 
     page,
     pageSize, 
     sortBy, 
     searchBy, 
     keyword, 
     tag }) {

     
      //요청 필드명 -> db필드명 
      let orderByField;
      if (sortBy === 'latest') {
        orderByField = 'created_at';
      }else if (sortBy === 'mostViewed') {
        orderByField = 'views';
      } else if (sortBy === 'mostCurated'){
        orderByField ='curation_count';
      }

      let searchField = searchBy
      if( searchBy === 'nickname') {
        searchField = 'author';
      } else if ( searchBy === 'content') {
        searchField = 'description';
      };
      
  // Repository 호출
  const { styles, totalItemCount } = await stylesRepository.findStylesWithOffset({
    page,
    pageSize,
    sortBy: orderByField,
    searchBy: searchField,
    keyword: keyword,
    tag: tag,
  });

  //전체 페이지 수 계산 
    const totalPages = calculateTotalPages(totalItemCount, pageSize);
    const currentPage = page; // 요청받은 페이지가 현재 페이지

  const data = styles.map(style =>
    StyleResponseDTO.fromPrismaEntity(style)
  )
return { currentPage, totalPages, totalItemCount, data }; 
}


// - 등록된 스타일 랭킹 목록을 조회할 수 있습니다.
// - `page` : number (현재 페이지 번호)
// - `pageSize` : number (페이지당 아이템 수)
// - `rankBy` : total | trendy | personality | practicality, costEffectiveness (랭킹 기준)
export class RankService {
  constructor(stylesRepository) {
    this.stylesRepository = stylesRepository;
  }

    async getRankStyles({
        page,
        pageSize,
        rankBy,
      }) {
        let sortBy = 'latest';
        let tag = null;

        switch (rankBy) {
            case 'total':
            sortBy = 'total';
            break;
            case 'trendy':
            sortBy = 'views';
            break;
            case 'personality':
            tag = '힙스터,스트릿';
            break;
            case 'practicality':
            tag = '데일리룩, 캐주얼';
            break;
            case 'costEffectiveness':
            sortBy = 'totalPrice';
            break;
            default:
            sortBy = 'latest';
            }
      const { styles, totalItemCount } = await stylesRepository.findStylesWithOffset({
          page,
          pageSize,
          sortBy,
          tag: tag,
        });
      
        //페이지네이션
      const totalPages = calculateTotalPages(totalItemCount, pageSize);
      const currentPage = page; 

      const data = styles.map((style, index) => {
        const ranking = (page - 1) * pageSize + index + 1; // 순위 계산
          const rating = 3.5; // 임시 평점

         return StyleResponseDTO.fromPrismaEntity(style, ranking, rating )    
        });
      return { currentPage, totalPages, totalItemCount, data }; 
    }
}
export const rankService = new RankService(stylesRepository)









