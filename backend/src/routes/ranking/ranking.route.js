import express from "express";

import { listStyleRanking } from "../../services/style/style.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  validateLimit,
  validateRankBy,
} from "../../classes/ranking/ranking.js";

const router = express.Router();

router.route("/").get(
  asyncHandler(async (req, res) => {
    const { rankBy = "total", cursor, limit = 10 } = req.query;
    validateRankBy(rankBy);
    validateLimit(limit);

    const rankingStyles = await listStyleRanking(rankBy, cursor, limit);
    res.status(200).json(rankingStyles);
  }),
);

export default router;
