import express from "express";
import * as commentController from "../../controllers/comment/comment.controller.js";

const router = express.Router();

router
  .route("/:commentId")
  .put(commentController.putComment)
  .delete(commentController.deleteComment);

export default router;
