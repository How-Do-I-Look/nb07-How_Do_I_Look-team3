import { Curation } from "../../classes/curation/curation.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../errors/errorHandler.js";
import { prisma } from "../../utils/prisma.js";

/**
 * 큐레이팅 등록
 */
export const createCurations = async (
  styleId,
  nickname,
  content,
  password,
  trendy,
  personality,
  practicality,
  costEffectiveness,
) => {

  const curation = await prisma.$transaction(async (tx) => {
    const createCuration = await tx.curation.create({
      data: {
        style_id: BigInt(styleId),
        nickname,
        content,
        password,
        trendy,
        personality,
        practicality,
        costEffectiveness,
      },
    });

    await tx.style.update({
      where: { id: BigInt(styleId) },
      data: {
        curation_count: {
          increment: 1,
        },
      },
    });

    return createCuration;
  });


  return Curation.fromEntity(curation);
};

//조회
export const getCurations = async (
  styleId,
  page,
  pageSize,
  searchBy,
  keyword,
) => {
  const skip = (page - 1) * pageSize;

  // 검색 조건
  let curationWhere = {
    style_id: BigInt(styleId),
  };

  if (searchBy !== "" && keyword !== "") {
    if (searchBy === "nickname") {
      curationWhere.nickname = { contains: keyword };
    }
    if (searchBy === "content") {
      curationWhere.content = { contains: keyword };
    }
  }

  if (searchBy && keyword) {
    if (searchBy === "nickname") {
      curationWhere.nickname = { contains: keyword };
    }

    if (searchBy === "content") {
      curationWhere.content = { contains: keyword };
    }
  }

  const totalItemCount = await prisma.curation.count({ where: curationWhere });
  const totalPages = Math.ceil(totalItemCount / pageSize);

  const curations = await prisma.curation.findMany({
    where: curationWhere,
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
  });

  const result = Curation.fromEntityList(curations);
  return {
    currentPage: Number(page),
    totalPages,
    totalItemCount,
    data: result,
  };
};

/**
 * 큐레이팅 수정
 */
export const updateCuration = async (
  curationId,
  nickname,
  content,
  password,
  trendy,
  personality,
  practicality,
  costEffectiveness,
) => {
  const curation = await prisma.curation.findUnique({
    where: { id: BigInt(curationId) },
  });

  if (!curation) {
    throw new BadRequestError();
  }

  if (curation.password !== password) {
    throw new ForbiddenError();
  }

  const updated = await prisma.curation.update({
    where: { id: BigInt(curationId) },
    data: {
      nickname,
      content,
      trendy,
      personality,
      practicality,
      costEffectiveness,
    },
  });

  return Curation.fromEntity(updated);
};

/**
 * 큐레이팅 삭제
 */
export const deleteCuration = async (curationId, password) => {
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

  const Completion = await prisma.$transaction(async (tx) => {
    const deletedCuration = await tx.curation.delete({
      where: { id: BigInt(curationId) },
    });

    await tx.style.update({
      where: { id: deletedCuration.style_id },
      data: {
        curation_count: {
          decrement: 1,
        },
      },
    });

    return deletedCuration;
  });

  return Curation.fromEntity(Completion);
};
