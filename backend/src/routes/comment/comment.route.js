import express from "express";
import * as commentService from "../../services/comment/comment.service.js";
import { Comment } from "../../classes/comment/comment.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();

router
  .route("/:commentId")
  .put(
    asyncHandler(async (req, res) => {
      // 답글 수정
      const { commentId } = req.params;
      Comment.validateId(commentId);

      const { content, password } = req.body;
      Comment.validateContent(content);
      Comment.validatePassword(password);

      // DB 조회 후 수정
      const comment = await commentService.updateComment(commentId, {
        content,
        password,
      });

      res.status(200).json(comment);
    }),
  )
  .delete(
    asyncHandler(async (req, res) => {
      // 답글 삭제
      const { commentId } = req.params;
      Comment.validateId(commentId);

      const { password } = req.body;
      Comment.validatePassword(password);

      // DB 조회 후 삭제
      const result = await commentService.deleteComment(commentId, password);

      res.status(200).json(result);
    }),
  );
export default router;
