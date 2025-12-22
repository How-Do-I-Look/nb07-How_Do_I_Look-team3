import express from "express";
import { styleController } from "../../controller/style/style.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { CurationValidator } from "../../validators/curation.validator.js";
import {
  createCuration,
  getCurations,
} from "../../services/curation/curation.service.js";

const router = express.Router();

router
  .route("/")
  .post(asyncHandler(styleController.createStyle))
  .get(asyncHandler(styleController.getGalleryStyles));

router
  .route("/:styleId")
  .put(asyncHandler(styleController.updateStyle))
  .delete(asyncHandler(styleController.deleteStyle))
  .get(asyncHandler(styleController.detailFindStyle));

// 조회, 등록
router
  .route("/:styleId/curations")

  .get(
    asyncHandler(async (req, res) => {
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
    }),
  )

  .post(
    asyncHandler(async (req, res) => {
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

      CurationValidator.validateId(styleId);
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

      const curation = await createCuration(
        styleId,
        nickname,
        content,
        password,
        trendy,
        personality,
        practicality,
        costEffectiveness,
      );

      res.status(200).json(curation);
    }),
  );

export default router;
