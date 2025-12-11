
import express from "express"
import { getGalleryStyles } from '../services/styles.service.js';
import { BadRequestError } from "../../errors/errorHandler.js";

const stlyeRouter = express.Router();


// - 최신순, 조회순, 큐레이팅순(큐레이팅 많은 순)으로 정렬 가능합니다.
// - 닉네임, 제목, 상세, 태그로 검색이 가능합니다.
stlyeRouter
.route("/")
.get(async (req, res, next) => {
  try {
    const { //프온트엔드가 url에 담아 보낸 모든정보(req.qurey) 받아 변수에 넣음
      type = 'gallery', // 갤러리 vs 랭킹 구분
      page = 1, 
      pageSize = 16,
      sortBy = 'latest', 
      rankBy, // 랭킹 전용 파라미터
      searchBy, 
      keyword, 
      tag 
    } = req.query;

    //페이지네이션 파라미터 유효성 검사
    const parsedPage = parseInt(page, 10);
    const parsedPageSize = parseInt(pageSize, 10)

    if (isNaN(parsedPage) || parsedPage <1 ) {
        throw new BadRequestError("페이지 번호는 1 이상의 숫자여야 합니다.");
    } 
    if (isNaN(parsedPageSize) || parsedPageSize < 1 || parsedPageSize > 30 ) {
        throw new BadRequestError("페이지 크기는 1에서 30 사이의 숫자여야 합니다.");
    }

     // 정렬 기준 유효성 검사
      const validSorts = ['latest', 'mostViewed', 'mostCurated'];
      if(type === 'gallery' && !validSorts.includes(sortBy)) {
        throw new BadRequestError(`잘못된 정렬 기준 입니다 ${sortBy}`);
      }


    const queryParams = { //위에서 추출한 파라미터 객체로 묶음
      page: parseInt(page), // 'page'를 숫자로 변환하여 전달 
      pageSize: parseInt(pageSize),
      sortBy, 
      searchBy, 
      keyword, 
      tag,
      rankBy // 랭킹 시 사용
    };

    let result;
    
  //랭킹 요청 
    if (type === 'ranking') {
      result = await getRankingStyles(queryParams);
    } else {
      // 갤러리 전용 서비스 함수 호출 (기존에 작업하던 함수)
      result = await getGalleryStyles(queryParams);
    }

    return res.status(200).json(result);

  } catch (e) {
    next(e); 
  }
});


// stlyeRouter
// .route("/:id")
// .get(getstyleId)

export default stlyeRouter;