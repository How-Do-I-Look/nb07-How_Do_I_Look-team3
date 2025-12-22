import { defaultValue } from "../../utils/string.util.js";
import {
  validateLimit,
  validatePage,
} from "../../classes/pagination/pagination.js";
import { validateSortBy } from "../../classes/style/style.js";
import { getGalleryStyles } from "../../services/style/style.service.js";

//갤러리목록 조회
export const getGalleryList = async (req, res) => {
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

  const parsedPage = parseInt(defaultValue(page, 1), 10);
  const parsedLimit = parseInt(defaultValue(limit, 16), 10);

  const queryParams = {
    page: parsedPage,
    limit: parsedLimit,
    sortBy,
    searchBy,
    keyword,
    tag,
    cursor,
  };

  const result = await getGalleryStyles(queryParams);

  return res.status(200).json(result);
};
