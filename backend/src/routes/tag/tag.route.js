import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as tagService from "../../services/tag/tag.service.js";

const router = express.Router();

router.route("/").get(
  asyncHandler(async (_, res) => {
    const tags = await tagService.getTags();
    res.status(200).json(tags);
  }),
);

export default router;
