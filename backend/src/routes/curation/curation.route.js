import express from "express";
import * as commentController from "../../controllers/comment/comment.controller.js";
import * as curationService from "../../services/curation/curation.service.js";

const { updateCuration, deleteCuration } = curationService;

const router = express.Router();

router.route("/:curationId/comments").post(commentController.postComment);

// 수정, 삭제
router
  .route("/:curationId")

  .patch(
    asyncHandler(async (req, res) => {
      const { curationId } = req.params;
      const {
        nickname,
        content,
        password,
        trendy,
        personality,
        practicality,
        costEffectiveness,
      } = req.body;

      CurationValidator.validateId(curationId);
      CurationValidator.validateUpdate({ password });

      const curation = await updateCuration(
        curationId,
        nickname,
        content,
        password,
        trendy,
        personality,
        practicality,
        costEffectiveness,
      );

      res.status(200).json(curation);
    }),
  )

  .delete(
    asyncHandler(async (req, res) => {
      const { curationId } = req.params;
      const { password } = req.body;

      CurationValidator.validateId(curationId);

      await deleteCuration(curationId, password);

      res.status(200).json({ message: "큐레이팅 삭제 성공" });
    }),
  );

export default router;
