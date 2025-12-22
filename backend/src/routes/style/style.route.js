import express from "express";
import { styleController } from "../../controller/style/style.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

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

export default router;
