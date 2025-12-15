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


// - 등록된 스타일 랭킹 목록을 조회할 수 있습니다.
// - `rankBy` : total | trendy | personality | practicality, costEffectiveness (랭킹 기준)
//평점 평가요인
const ratingfactors = {
    views: 0.1, //조회수 (간접지표))
    curations: 1.0 //큐레이팅 수 (직접적인 사용자 참여 지표)
  };
  const max_rating = 5.0; //최대평점
  const max_score = 100; // 최대점수
export class GetStyleRanks {
  constructor(stylesRepository) {
    this.stylesRepository = stylesRepository;
  }

    async StylesRank({
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
            sortBy = 'costEffectiveness';
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

     //전체 페이지 수 계산
      const totalPages = calculateTotalPages(totalItemCount, pageSize);
      const currentPage = page;

      //순위계산
      const data = styles.map((style, index) => {
        const ranking = (page - 1) * pageSize + index + 1;

          const viewCount = style.views || 0;
          const curationCount = style.curation_count || 0
          //점수계산(실제 총점)
          const rawScore = (viewCount * ratingfactors.views ) +
                           (curationCount * ratingfactors.curations);
         // 평점으로 변환 (0.0~5.0)
         let rating = (rawScore / max_score) * max_rating;
            // 평점 상한선 및 하한선 설정 (1.0 ~ 5.0 사이로 유지)
           if (rating > max_rating) {
               rating = max_rating;
             }
           if (rating < 1.0) {
            rating = 1.0;
            }

          // 평점을 소수점 첫째 자리까지 반올림
           rating = Math.round(rating * 10) / 10;

         return Stylelist.fromPrismaEntity(style, ranking, rating )
        });
      return { currentPage, totalPages, totalItemCount, data };
    }
}
export const getStyleRanks = new GetStyleRanks(stylesRepository)
