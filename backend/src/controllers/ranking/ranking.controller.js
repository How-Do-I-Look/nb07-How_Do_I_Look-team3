import * as styleService from "../../services/style/style.service.js";
import {
  validateLimit,
  validateRankBy,
} from "../../classes/ranking/ranking.js";
class RankingController {
  async listStyleRanking(req, res) {
    const { rankBy = "total", cursor, limit = 10, page = 1 } = req.query;
    validateRankBy(rankBy);
    validateLimit(limit);
console.log('Backend Controller - cursor:', cursor);
    const rankingStyles = await styleService.listStyleRanking(
      rankBy,
      cursor,
      Number(limit),
      Number(page)
    );
    res.status(200).json(rankingStyles);
  }
}

export const rankingController = new RankingController();
