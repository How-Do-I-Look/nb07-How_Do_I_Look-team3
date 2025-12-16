import express from "express";

import {
  createStyle,
  deleteStyle,
  updateStyle,
  detailFindStyle,
} from "../../services/style/style.service.js";
import { validateRequiredField } from "../../classes/style/style.js";
import { BadRequestError } from "../../errors/errorHandler.js";
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

    validateRequiredField(req.body);

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
      if (!password || !title || !description) {
        throw new BadRequestError("필수 입력 값이 누락되었습니다.");
      }
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
      if (!styleId) {
        throw new BadRequestError("필수 입력 값이 누락되었습니다. : styleId");
      }
      if (!password) {
        throw new BadRequestError("필수 입력 값이 누락되었습니다. : password");
      }

      await deleteStyle(styleId, password);

      res.status(200).json({ message: "스타일 삭제 성공" });
    }),
  )
  .get(
    asyncHandler(async (req, res) => {
      const { styleId } = req.params;
      const { cursor, limit } = req.query;
      const take = parseInt(limit, 10);
      if (!styleId) {
        throw new BadRequestError("필수 입력 값이 누락되었습니다. : styleId");
      }
      if (isNaN(styleId)) {
        throw new BadRequestError("styleId는 숫자여야 합니다.");
      }
      if (styleId <= 0) {
        throw new BadRequestError("styleId는 0보다 커야 합니다.");
      }
      if (isNaN(take) || take <= 0) {
        throw new BadRequestError("유효하지 않은 limit 값입니다.");
      }

      const detailStyle = await detailFindStyle(styleId, cursor, take);

      res.status(200).json(detailStyle);
    }),
  );

export default router;
