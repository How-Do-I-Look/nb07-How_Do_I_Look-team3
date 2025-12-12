import express from "express";

import {
  createStyle,
  deleteStyle,
  updateStyle,
} from "../../services/style/style.service.js";
import {validateRequiredField} from '../../classes/style/style.js';
import { BadRequestError, NotFoundError } from "../../errors/errorHandler.js";
import { prisma } from "../../utils/prisma.js";
const router = express.Router();

router.route("/").post(async (req, res, next)=> {
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

    const createdStyle = await createStyle(author, title, description, password, items, tags, imageUrls);
    res.status(201).json(createdStyle);
  } catch(error) {
    next(error);
  }

});
router
  .route("/:styleId")
  .put(async (req, res, next) => {
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
      const updatedStyle = await updateStyle(styleId, title, description, password, items, tags, imageUrls);
      res.status(200).json(updatedStyle);
    } catch(error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const { styleId } = req.params;
      const { password } = req.body;
      if (!styleId) {
        throw new BadRequestError("필수 입력 값이 누락되었습니다. : styleId");
      }
      if (!password) {
        throw new BadRequestError("필수 입력 값이 누락되었습니다. : password");
      }

      const deletedStyle = deleteStyle(styleId, password);

      res.status(200).json({message:'스타일 삭제 성공'});
    } catch(error) {
      next(error);
    }
  });


export default router;
