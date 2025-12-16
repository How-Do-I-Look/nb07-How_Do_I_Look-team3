
//랭킹 라우터
import express from "express";
import { BadRequestError } from '../../errors/errorHandler.js';
import { getStyleRanks } from "../../services/style/styleRead.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const router = express.Router();

//스타일 목록 전체 조회(랭킹)
//전체, 트렌디, 개성, 실용성, 가성비 기준으로 스타일 랭킹 목록을 조회할 수 있습니다.
//각 스타일의 대표 이미지, 제목, 닉네임, 태그, 스타일 구성, 조회수, 큐레이팅수가 표시됩니다.
router
.route("/")
.get(asyncHandler(async (req, res, next) => {

    const {
      rankBy, //(total, trendy, personality, practicality, costEffectiveness)
      page = 1,
      pageSize = 16,
    } = req.query;


    if (!rankBy) {
      throw new BadRequestError("rankBy 파라미터를 지정해야 합니다.")
    }

    //페이지네이션 파라미터 유효성 검사
    const parsedPage = parseInt(page, 10);
    const parsedPageSize = parseInt(pageSize, 10)

    if (isNaN(parsedPage) || parsedPage <1 ) {
        throw new BadRequestError("페이지 번호는 1 이상의 숫자여야 합니다.");
    }
    if (isNaN(parsedPageSize) || parsedPageSize < 1 || parsedPageSize > 30 ) {
        throw new BadRequestError("페이지 크기는 1에서 30 사이의 숫자여야 합니다.");
    }

    const queryParams = {
      rankBy,
      page: parsedPage,
      pageSize: parsedPageSize,
    };

     const result = await getStyleRanks.StylesRank(queryParams);
     return res.status(200).json(result);
}));


export default router;
