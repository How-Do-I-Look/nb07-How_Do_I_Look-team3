import express from "express";
import * as tagController from "../../controllers/tag/tag.controller.js";

const router = express.Router();

router.route("/").get(tagController.getTags);

export default router;
