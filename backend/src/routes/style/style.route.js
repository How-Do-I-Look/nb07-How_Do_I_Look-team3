import express from "express";
import { styleController } from "../../controllers/style/style.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as curationController from "../../controllers/curation/curation.controller.js";


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
  .get(curationController.getCuration)
  .post(curationController.createCuration);

export default router;
