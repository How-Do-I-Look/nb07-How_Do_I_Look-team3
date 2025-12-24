import { Comment } from "../../classes/comment/comment.js";
import * as commentService from "../../services/comment/comment.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const postComment = asyncHandler(async (req, res) => {
  // 답글 등록
  const { curationId } = req.params;
  Comment.validateId(curationId);

  const { content, password } = req.body;
  Comment.validateContent(content);
  Comment.validatePassword(password);

  // DB 조회 후 등록
  const comment = await commentService.createComment(curationId, {
    content,
    password,
  });

  res.status(200).json(comment);
});

export const putComment = asyncHandler(async (req, res) => {
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
});

export const deleteComment = asyncHandler(async (req, res) => {
  // 답글 삭제
  const { commentId } = req.params;
  Comment.validateId(commentId);

  const { password } = req.body;
  Comment.validatePassword(password);

  // DB 조회 후 삭제
  const result = await commentService.deleteComment(commentId, password);

  res.status(200).json(result);
});
