import express from "express";

import {
  createStyle,
  deleteStyle,
  updateStyle,
  detailFindStyle,
} from "../../services/style/style.service.js";
import { validateRequiredField } from "../../classes/style/style.js";
import { BadRequestError } from "../../errors/errorHandler.js";
const router = express.Router();

router.route("/").post((req, res, next) => {
  try {
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

    const createdStyle = createStyle(
      author,
      title,
      description,
      password,
      items,
      tags,
      imageUrls,
    );
    res.status(201).json(createdStyle);
  } catch (error) {
    next(error);
  }
});
router
  .route("/:styleId")
  .put((req, res, next) => {
    try {
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
      if (!password || !title || !description || !password) {
        throw new BadRequestError("필수 입력 값이 누락되었습니다.");
      }
      const updatedStyle = updateStyle(
        styleId,
        title,
        description,
        password,
        items,
        tags,
        imageUrls,
      );
      res.status(200).json(updatedStyle);
    } catch (error) {
      next(error);
    }
  })
  .delete((req, res, next) => {
    try {
      const { styleId } = req.params;
      const { password } = req.body;
      if (!styleId) {
        throw new BadRequestError("필수 입력 값이 누락되었습니다. : styleId");
      }
      if (!password) {
        throw new BadRequestError("필수 입력 값이 누락되었습니다. : password");
      }

      deleteStyle(styleId, password);

      res.status(200).json({ message: "스타일 삭제 성공" });
    } catch (error) {
      next(error);
    }
  })
  .get(async (req, res, next) => {
    try {
      const { styleId } = req.params;
      if (!styleId) {
        throw new BadRequestError("필수 입력 값이 누락되었습니다. : styleId");
      }
      if (isNaN(styleId)) {
        throw new BadRequestError("styleId는 숫자여야 합니다.");
      }
      if (styleId <= 0) {
        throw new BadRequestError("styleId는 0보다 커야 합니다.");
      }
      const detailStyle = await detailFindStyle(styleId);

      res.status(200).json(detailStyle);
    } catch (error) {
      next(error);
    }
  });

export default router;
