import express from "express";

import {
  getGalleryStyleList,
  getGalleryStyle,
  createStyle,
  deleteStyle,
  updateStyle,
} from "../../services/style/style.service.js";
import {
  getCurations,
  createCuration,
} from "../../services/curation/curation.service.js";
const router = express.Router();

router.route("/").post(createStyle);
router
  .route("/:styleId")
  .put(updateStyle)
  .delete(deleteStyle);
router.route("/:styleId/curations").get(getCurations).post(createCuration);

export default router;
