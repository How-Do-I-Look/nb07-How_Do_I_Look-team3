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
import { CurationValidator } from "../../validators/curation.validator.js";
import { Curation } from "../../classes/curation/curation.js";

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

// 수정, 삭제
router.route("/:curationId")

.patch(asyncHandler(async (req, res) => {

  const { curationId } = req.params;
  const { nickname, content, password, trendy, personality, practicality, costEffectiveness } = req.body;

  CurationValidator.validateId(curationId);
  CurationValidator.validateUpdate( { password} );

  const curation = await updateCuration(curationId, nickname, content, password, trendy, personality, practicality, costEffectiveness);

  res.status(200).json(curation);
}))

.delete(asyncHandler(async (req, res) => {

  const { curationId } = req.params;
  const { password } = req.body;

  CurationValidator.validateId(curationId);

  const curation = await deleteCuration(curationId, password);

  res.status(200).json({message: "큐레이팅 삭제 성공"});
}));

export default router;
