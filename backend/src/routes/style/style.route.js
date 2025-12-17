import express from "express";

import {
  createStyle,
  deleteStyle,
  updateStyle,
  detailFindStyle,
} from "../../services/style/style.service.js";
import { validateRequiredField } from "../../classes/style/style.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const router = express.Router();

router.route("/").post(
  asyncHandler(async (req, res) => {
    const {
      nickname: author,
      title,
      content: description,
      password,
      categories: items,
      tags,
      imageUrls,
    } = req.body;

    validateRequiredField(req.body, "POST");

    const createdStyle = await createStyle(
      author,
      title,
      description,
      password,
      items,
      tags,
      imageUrls,
    );
    res.status(201).json(createdStyle);
  }),
);
router
  .route("/:styleId")
  .put(
    asyncHandler(async (req, res) => {
      const { styleId } = req.params;
      const {
        //nickname: author,
        title,
        content: description,
        password,
        categories: items,
        tags,
        imageUrls,
      } = req.body;
      validateRequiredField({ styleId, ...req.body }, "PUT");

      const updatedStyle = await updateStyle(
        styleId,
        title,
        description,
        password,
        items,
        tags,
        imageUrls,
      );
      res.status(200).json(updatedStyle);
    }),
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { styleId } = req.params;
      const { password } = req.body;

      validateRequiredField({ styleId, password }, "DELETE");

      await deleteStyle(styleId, password);

      res.status(200).json({ message: "스타일 삭제 성공" });
    }),
  )
  .get(
    asyncHandler(async (req, res) => {
      const { styleId } = req.params;
      const { cursor, limit } = req.query;
      const take = parseInt(limit, 10);

      validateRequiredField({ styleId, take }, "GET");

      const detailStyle = await detailFindStyle(styleId, cursor, take);

      res.status(200).json(detailStyle);
    }),
  );

export default router;
