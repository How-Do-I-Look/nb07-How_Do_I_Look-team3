import express from "express";

import {
  createStyle,
  deleteStyle,
  updateStyle,
  detailFindStyle,
  getGalleryStyles,
} from "../../services/style/style.service.js";
import {
  validateCategories,
  validateContent,
  validateImageUrls,
  validateNickname,
  validatePage,
  validatePassword,
  validateSortBy,
  validateStyleId,
  validateTags,
  validateTitle,
} from "../../classes/style/style.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { defaultValue } from "../../utils/string.util.js";
import {
  validateLimit,
  validatePage,
} from "../../classes/pagination/pagination.js";

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
  .get(
    asyncHandler(async (req, res) => {
      const {
        limit = 16,
        sortBy = "latest",
        searchBy,
        keyword,
        tag,
        cursor,
        page,
      } = req.query;

      validatePage(page);
      validateLimit(limit);
      validateSortBy(sortBy);

      // 페이지네이션 파라미터 파싱 및 기본값 설정
      const parsedPage = parseInt(defaultValue(page, 1), 10);
      const parsedlimit = parseInt(defaultValue(limit, 16), 10);

      const queryParams = {
        page: parsedPage,
        limit: parsedlimit,
        sortBy,
        searchBy,
        keyword,
        tag,
        cursor,
      };

      const result = await getGalleryStyles(queryParams);
      return res.status(200).json(result);
    }),
  );

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
