import express from "express";
import {
  updateCuration,
  deleteCuration,
} from "../../services/curation/curation.service.js";
const curationRouter = express.Router();

curationRouter.route("/:curationId").patch(updateCuration).delete(deleteCuration);
 
export default curationRouter;
