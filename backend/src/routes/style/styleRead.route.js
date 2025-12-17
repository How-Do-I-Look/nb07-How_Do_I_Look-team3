import express from "express";
import { BadRequestError } from "../../errors/errorHandler.js";
import { getGalleryStyles } from "../../services/style/styleRead.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const styleRouter = express.Router();

// - 최신순, 조회순, 큐레이팅순(큐레이팅 많은 순)으로 정렬 가능합니다.
// - 닉네임, 제목, 상세, 태그로 검색이 가능합니다.
styleRouter.route("/").get(
  asyncHandler(async (req, res) => {
    const {
      pageSize = 16,
      sortBy = "latest",
      searchBy,
      keyword,
      tag,
      cursor,
    } = req.query;

    // 페이지네이션 파라미터 유효성 검사
    const parsedPageSize = parseInt(pageSize, 10);

    if (isNaN(parsedPageSize) || parsedPageSize < 1 || parsedPageSize > 30) {
      throw new BadRequestError(
        "페이지 크기는 1에서 30 사이의 숫자여야 합니다.",
      );
    }
    // 정렬 기준 유효성 검사
    const validGallerySorts = ["latest", "mostViewed", "mostCurated"];
    if (!validGallerySorts.includes(sortBy)) {
      throw new BadRequestError(`잘못된 정렬 기준 입니다: ${sortBy}`);
    }

    const queryParams = {
      pageSize: parsedPageSize,
      sortBy,
      searchBy,
      keyword,
      tag,
      cursor,
    };

    const result = await getGalleryStyles(queryParams);
    return res.status(200).json(result);
  }),
);

export default styleRouter;
