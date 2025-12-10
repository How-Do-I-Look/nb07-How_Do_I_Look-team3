import express from "express";
import { getStyle, createStyle, updateStyle, deleteStyle } from "../../services/style.service.js";
const router = express.Router();

router.route("/:styleId").patch(updateStyle).delete(deleteStyle);

export default router;