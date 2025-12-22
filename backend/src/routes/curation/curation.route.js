import express from "express";
import * as commentController from "../../controllers/comment/comment.controller.js";
import * as curationService from "../../services/curation/curation.service.js";

const { updateCuration, deleteCuration } = curationService;

const router = express.Router();

router.route("/:curationId/comments").post(commentController.postComment);

router.route("/:curationId").patch(updateCuration).delete(deleteCuration);

export default router;
