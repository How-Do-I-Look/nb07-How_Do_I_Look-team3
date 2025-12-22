import * as styleService from "../../services/style/style.service.js";

import {
  validateCategories,
  validateContent,
  validateImageUrls,
  validateNickname,
  validatePassword,
  validateStyleId,
  validateTags,
  validateTitle,
  validateSortBy,
} from "../../classes/style/style.js";
import {
  validateLimit,
  validatePage,
} from "../../classes/pagination/pagination.js";
import { defaultValue } from "../../utils/string.util.js";

class StyleController {
  async createStyle(req, res) {
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
    const createdStyle = await styleService.createStyle(
      author,
      title,
      description,
      password,
      items,
      tags,
      imageUrls,
    );

    res.status(201).json(createdStyle);
  }
  async updateStyle(req, res) {
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

    const updatedStyle = await styleService.updateStyle(
      styleId,
      title,
      description,
      password,
      items,
      tags,
      imageUrls,
    );
    res.status(200).json(updatedStyle);
  }
  async deleteStyle(req, res) {
    const { styleId } = req.params;
    const { password } = req.body;
    validateStyleId(styleId);
    validatePassword(password);

    await styleService.deleteStyle(styleId, password);

    res.status(200).json({ message: "스타일 삭제 성공" });
  }
  async detailFindStyle(req, res) {
    const { styleId } = req.params;
    const { cursor, limit } = req.query;

    validateStyleId(styleId);
    validateLimit(limit);
    const take = parseInt(limit, 10);
    const detailStyle = await styleService.detailFindStyle(
      styleId,
      cursor,
      take,
    );

    res.status(200).json(detailStyle);
  }
  async getGalleryStyles(req, res) {
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

    const result = await styleService.getGalleryStyles(queryParams);
    return res.status(200).json(result);
  }
}

export const styleController = new StyleController();
