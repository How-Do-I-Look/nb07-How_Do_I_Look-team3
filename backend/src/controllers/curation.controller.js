import {
  createCurations,
  getCurations,
} from "../services/curation/curation.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CurationValidator } from "../validators/curation.validator.js";

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

  const curation = await getCurations(
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
  const curation = await createCurations(
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
