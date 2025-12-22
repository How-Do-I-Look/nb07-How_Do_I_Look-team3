import * as tagService from "../../services/tag/tag.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getTags = asyncHandler(async (_, res) => {
  const tags = await tagService.getTags();
  res.status(200).json(tags);
});
