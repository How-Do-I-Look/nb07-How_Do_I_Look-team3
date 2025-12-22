import express from "express";
import * as tagController from "../../controller/tag/tag.controller.js";

const router = express.Router();

router.route("/").get(tagController.getTags);

export default router;
