import express from "express";
import * as commentController from "../../controllers/comment/comment.controller.js";
import * as curationController from "../../controllers/curation/curation.controller.js";

const { updateCuration, deleteCuration } = curationController;

const router = express.Router();

router.route("/:curationId/comments").post(commentController.postComment);

router.route("/:curationId").patch(updateCuration).delete(deleteCuration);

export default router;
