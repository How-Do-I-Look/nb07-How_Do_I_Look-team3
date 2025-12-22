import express from "express";

import {
  createStyle,
  deleteStyle,
  updateStyle,
  detailFindStyle,
} from "../../services/style/style.service.js";
import {
  validateCategories,
  validateContent,
  validateImageUrls,
  validateNickname,
  validatePassword,
  validateStyleId,
  validateTags,
  validateTitle,
} from "../../classes/style/style.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validateLimit } from "../../classes/pagination/pagination.js";
import * as styleController from "../../controller/style/style.controller.js";

const router = express.Router();

router
  .route("/")
  .post(
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
      validateNickname(author);
      validateTitle(title);
      validatePassword(password);
      validateCategories(items);
      validateTags(tags);
      validateImageUrls(imageUrls);

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
  )
  .get(asyncHandler(styleController.getGalleryList));

router
  .route("/:styleId")
  .put(
    asyncHandler(async (req, res) => {
      const { styleId } = req.params;
      const {
        title,
        content: description,
        password,
        categories: items,
        tags,
        imageUrls,
      } = req.body;
      validateStyleId(styleId);
      validateTitle(title);
      validateContent(description);
      validatePassword(password);
      validateCategories(items);
      validateTags(tags);
      validateImageUrls(imageUrls);

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
      validateStyleId(styleId);
      validatePassword(password);

      await deleteStyle(styleId, password);

      res.status(200).json({ message: "스타일 삭제 성공" });
    }),
  )
  .get(
    asyncHandler(async (req, res) => {
      const { styleId } = req.params;
      const { cursor, limit } = req.query;

      validateStyleId(styleId);
      validateLimit(limit);
      const take = parseInt(limit, 10);
      const detailStyle = await detailFindStyle(styleId, cursor, take);

      res.status(200).json(detailStyle);
    }),
  );

export default router;
