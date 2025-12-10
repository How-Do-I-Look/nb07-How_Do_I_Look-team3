import express from "express";
import {
  updateCuration,
  deleteCuration,
} from "../../services/curation/curation.service.js";
const router = express.Router();

router.route("/:curationId").patch(updateCuration).delete(deleteCuration);
 
export default router;
