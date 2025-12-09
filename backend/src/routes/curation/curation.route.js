import express from "express";
import {
  updateCuration,
  deleteCuration,
} from "../../services/curation/curationService.js";
const router = express.Router();

router.route("/:curationId").patch(updateCuration).delete(deleteCuration);

export default router;
