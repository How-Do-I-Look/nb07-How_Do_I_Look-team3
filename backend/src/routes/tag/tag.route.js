import express from "express";
import { getTags } from "../../services/tag/tag.service.js";


const router = express.Router();

router.route("/").get(async (req, res, next) => {
  try {
    const tags = await getTags();
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
});

export default router;

