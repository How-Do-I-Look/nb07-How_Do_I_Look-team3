import express from "express";

import { rankingController } from "../../controllers/ranking/ranking.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const router = express.Router();

router.route("/").get(asyncHandler(rankingController.listStyleRanking));

export default router;
