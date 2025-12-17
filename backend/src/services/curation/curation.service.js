import { prisma } from "../../utils/prisma.js";
import { NotFoundError, ForbiddenError, BadRequestError } from "../../errors/errorHandler.js";

import { CurationValidator } from "../../validators/curation.validator.js";

/**
 * 큐레이팅 등록
 */
export const createCuration = async (req, res) => {
  const { styleId } = req.params;
  const body = req.body;

  CurationValidator.validateId(styleId);
  CurationValidator.validateCreate(body);

  const curation = await prisma.curation.create({
    data: {
      nickname:body.nickname,
      content:body.content,
      password:body.password,
      trendy:body.trendy,
      personality:body.personality,
      practicality:body.practicality,
      costEffectiveness:body.costEffectiveness,

    style: {
      connect: { id: BigInt(styleId) },
    },
  },
});

res.status(200).json(curation);
};

//조회
export const getCurations = async (req, res) => {
  const { styleId } = req.params;
  const {
    page = 1,
    pageSize = 10,
    searchBy,
    keyword,
  } = req.query;

  CurationValidator.validateList({ styleId, page, pageSize, searchBy, keyword });

  const skip = (page - 1) * pageSize;

  // 검색 조건
  let where = {
    style_id: BigInt(styleId),
  };

  if (searchBy && keyword) {
    if (searchBy === "nickname") {
      where.nickname = { contains: keyword };
    }

    if (searchBy === "content") {
      where.content = { contains: keyword };
    }

  }

  const [totalItemCount, data] = await Promise.all([
    prisma.curation.count({ where }),

    prisma.curation.findMany({
      where,
      skip: Number(skip),
      take: Number(pageSize),
      orderBy: { created_at: "desc" },

      include: {
        reply: {
          select: {
            id: true,
            nickname: true,
            content: true,
            created_at: true,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalItemCount / pageSize);

  res.status(200).json({
    currentPage: Number(page),
    totalPages,
    totalItemCount,
    data,
  });
};


/**
 * 큐레이팅 수정
 */
export const updateCuration = async (req, res) => {
  const { curationId } = req.params;
  const body = req.body;

  CurationValidator.validateId(curationId);
  CurationValidator.validateUpdate(body);

  const curation = await prisma.curation.findUnique({
    where: { id: BigInt(curationId) },
  });

  if (!curation) {
    throw new NotFoundError();
  }

  if (curation.password !== body.password) {
    throw new ForbiddenError();
  }

  const updated = await prisma.curation.update({
    where: { id: BigInt(curationId) },
    data: {
      nickname: body.nickname,
      content: body.content,
      trendy: body.trendy,
      personality: body.personality,
      practicality: body.practicality,
      costEffectiveness: body.costEffectiveness,
    },
  });

  res.status(200).json(updated);
};

/**
 * 큐레이팅 삭제
 */
export const deleteCuration = async (req, res) => {
  const { curationId } = req.params;
  const { password } = req.body;

  CurationValidator.validateId(curationId);

  if (!password) {
    throw new BadRequestError();
  }

  const curation = await prisma.curation.findUnique({
    where: { id: BigInt(curationId) },
  });

  if (!curation) {
    throw new NotFoundError();
  }

  if (curation.password !== password) {
    throw new ForbiddenError();
  }

  await prisma.curation.delete({
    where: { id: BigInt(curationId) },
  });

  res.status(200).json({ message: "큐레이팅 삭제 성공" });
};
