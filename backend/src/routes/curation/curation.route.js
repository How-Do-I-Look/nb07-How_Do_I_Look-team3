import express from "express";
import {
  updateCuration,
  deleteCuration,
} from "../../services/curation/curation.service.js";
<<<<<<< HEAD
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

router.route("/:curationId").patch(updateCuration).delete(deleteCuration);

export default router;
