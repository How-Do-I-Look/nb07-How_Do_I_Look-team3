import * as curationService from "../../services/curation/curation.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { CurationValidator } from "../../validators/curation.validator.js";

export const getCuration = asyncHandler(async (req, res) => {
  const { styleId } = req.params;
  const { page = 1, pageSize = 10, searchBy, keyword } = req.query;

  CurationValidator.validateId(styleId);
  CurationValidator.validateList({
    styleId,
    page,
    pageSize,
    searchBy,
    keyword,
  });

  const curation = await curationService.getCurations(
    styleId,
    page,
    pageSize,
    searchBy,
    keyword,
  );

  res.status(200).json(curation);
});

/**
 * 큐레이션 등록 (POST)
 */
export const createCuration = asyncHandler(async (req, res) => {
  const { styleId } = req.params;
  const {
    nickname,
    content,
    password,
    trendy,
    personality,
    practicality,
    costEffectiveness,
  } = req.body;

  // 1️⃣ ID 검증
  CurationValidator.validateId(styleId);

  // 2️⃣ 생성용 검증
  CurationValidator.validateCreate({
    styleId,
    nickname,
    content,
    password,
    trendy,
    personality,
    practicality,
    costEffectiveness,
  });

  // 3️⃣ 서비스 호출
  const curation = await curationService.createCurations(
    styleId,
    nickname,
    content,
    password,
    trendy,
    personality,
    practicality,
    costEffectiveness,
  );

  res.status(201).json(curation);
});

// 큐레이션 수정

export const updateCuration = asyncHandler(async (req, res) => {
      const { curationId } = req.params;
      const {
        nickname,
        content,
        password,
        trendy,
        personality,
        practicality,
        costEffectiveness,
      } = req.body;

      CurationValidator.validateId(curationId);
      CurationValidator.validateUpdate({ nickname,
        content,
        password,
        trendy,
        personality,
        practicality,
        costEffectiveness });

      const curation = await curationService.updateCuration(
        curationId,
        nickname,
        content,
        password,
        trendy,
        personality,
        practicality,
        costEffectiveness,
      );

      res.status(200).json(curation);
    })

    export const deleteCuration = (
    asyncHandler(async (req, res) => {
      const { curationId } = req.params;
      const { password } = req.body;

      //validateId(curationId);

      await curationService.deleteCuration(curationId, password);

      res.status(200).json({ message: "큐레이팅 삭제 성공" });
    })
  )
