import express from "express";
import {
  createCuration,
  getCurations,
  updateCuration,
  deleteCuration,
} from "../../services/curation/curation.service.js";
import { createComment } from "../../services/comment/comment.service.js";
import { Comment } from "../../classes/comment/comment.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();

router.route("/:curationId/comments").post(asyncHandler(async (req, res) => {
  // 답글 등록
  const { curationId } = req.params;
  Comment.validateId(curationId);

  const { content, password } = req.body;
  Comment.validateContent(content);
  Comment.validatePassword(password);

  // DB 조회 후 등록
  const comment = await createComment(curationId, {
    content,
    password,
  });

  res.status(200).json(comment);
}));

// 조회 (스타일 기준)
router.get("/style/:styleId", asyncHandler(getCurations));

// 등록
router.post("/style/:styleId", asyncHandler(createCuration));

// 수정, 삭제
router.route("/:curationId").patch(updateCuration).delete(deleteCuration);

export default router;
