import express from "express";
import * as commentController from "../../controllers/comment/comment.controller.js";
import * as curationController from "../../controllers/curation/curation.controller.js";

const router = express.Router();

router.route("/:curationId/comments").post(commentController.postComment);

// 수정, 삭제
router
  .route("/:curationId")
  .patch(curationController.updateCuration)
  .delete(curationController.deleteCuration)
export default router;
