// - `page` : number (현재 페이지 번호)
// - `pageSize` : number (페이지당 아이템 수)
// - `sortBy` : latest | mostViewed | mostCurated (정렬 기준)
// - `searchBy` : nickname | title | content | tag (검색 기준)
// - `keyword` : string (검색어)
// - `tag` :

import express from "express"
import { getStyle, getstyleId } from "../../services/curation/style.service";

const stlyeRouter = express.Router();

stlyeRouter.get('/', async (req, res, next) => {
  try {
    const { //프온트엔드가 url에 담아 보낸 모든정보(req.qurey) 받아 변수에 넣음
      type = 'gallery', // 갤러리 vs 랭킹 구분
      cursor, 
      pageSize = 16, 
      sortBy = 'latest', 
      rankBy, // 랭킹 전용 파라미터
      searchBy, 
      keyword, 
      tag 
    } = req.query;

    const queryParams = { //위에서 추출한 파라미터 객체로 묶음
      cursor, 
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
      result = await stylesService.getRankingStyles(queryParams); 
    } else {
      // 갤러리 전용 서비스 함수 호출 (기존에 작업하던 함수)
      result = await stylesService.getGalleryStyles(queryParams); 
    }

    return res.status(200).json(result);

  } catch (e) {
    next(e); 
  }
});


stlyeRouter
.route("/:id")
.get(getstyleId)

export default stlyeRouter;