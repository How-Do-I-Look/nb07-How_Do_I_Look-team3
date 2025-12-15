import { StyleCategory } from "../../../generated/prisma/index.js";
import { Style } from "../../classes/style/style.js";
import { ForbiddenError, NotFoundError } from "../../errors/errorHandler.js";
import { prisma } from "../../utils/prisma.js";

const HOST_NAME = process.env.DEV_HOST_NAME || "http://localhost:3000";

/**
 * 새로운 스타일 생성
 * 스타일 정보, 연관된 이미지, 아이템, 태그를 같이 저장
 * @param {String} author - 작성자
 * @param {String} title - 제목
 * @param {String} description - 설명
 * @param {String} password - 비밀번호
 * @param {Object} items - 스타일 구성
 * @param {Array} tags - 스타일 태그
 * @param {Array} imageUrls - 스타일 이미지
 * @returns {Style} - newStyle - 스타일 반환
 */
export async function createStyle(
  author,
  title,
  description,
  password,
  items,
  tags,
  imageUrls,
) {
  const newStyle = await prisma.$transaction(async (tr) => {
    {
      const styles = await tr.style.create({
        data: {
          title,
          author,
          description,
          password,
        },
      });
      const styleId = styles.id;

      await tr.styleImage.createMany({
        data: parseStyleImageUrl(imageUrls, styleId),
      });

      await tr.styleItem.createMany({
        data: parseStyleItemKeys(items, styleId),
      });
      await upsertTags(tr, tags, styleId);

      const result = await tr.style.findUnique({
        where: { id: styleId },
        include: {
          images: {
            orderBy: { order: "desc" },
          },
          items: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
      return result;
    }
  });

  return Style.fromEntity(newStyle);
}

/**
 * 스타일 수정
 * 연관된 스타일 정보 제거 후 재 등록하는 방식으로 변경
 * @param {BigInt} styleId - 스타일 아이디
 * @param {String} title - 제목
 * @param {String} description - 설명
 * @param {String} password - 비밀번호
 * @param {Object} items - 스타일 구성
 * @param {Array} tags - 스타일 태그
 * @param {Array} imageUrls - 스타일 이미지
 * @returns {Style} - newStyle - 변경된 내용의 스타일 반환
 */
export async function updateStyle(
  styleId,
  title,
  description,
  password,
  items,
  tags,
  imageUrls,
) {
  const existStyle = await prisma.style.findUnique({
    where: { id: styleId },
  });
  if (!existStyle) {
    return new NotFoundError("수정하려는 스타일이 없습니다.");
  }
  if (existStyle.password !== password) {
    return new ForbiddenError("비밀번호가 틀렸습니다.");
  }
  const newStyle = await prisma.$transaction(async (tr) => {
    await tr.styleImage.deleteMany({ where: { style_id: styleId } });
    await tr.styleItem.deleteMany({ where: { style_id: styleId } });
    await tr.styleTag.deleteMany({ where: { style_id: styleId } });

    await tr.style.update({
      where: { id: styleId, password },
      data: {
        title,
        description,
      },
    });

    if (imageUrls) {
      await tr.styleImage.createMany({
        data: parseStyleImageUrl(imageUrls, styleId),
      });
    }

    if (items) {
      await tr.styleItem.createMany({
        data: parseStyleItemKeys(items, styleId),
      });
    }
    if (tags) {
      await upsertTags(tr, tags, styleId);
    }
    const result = await tr.style.findUnique({
      where: { id: styleId },
      include: {
        images: {
          orderBy: { order: "desc" },
        },
        items: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return result;
  });
  return Style.fromEntity(newStyle);
}

/**
 * 스타일 삭제
 * @param {BigInt} styleId - 스타일 아이디
 * @returns {Style} - 스타일 반환
 */
export async function deleteStyle(styleId, password) {
  const findStyle = await prisma.style.findUnique({
    where: {
      id: styleId,
      password,
    },
  });
  if (!findStyle) throw new NotFoundError("존재하지않습니다.");
  const existStyle = await prisma.style.findUnique({
    where: { id: styleId },
  });
  if (!existStyle) {
    return new NotFoundError("삭제하려는 스타일이 없습니다.");
  }
  if (existStyle.password !== password) {
    return new ForbiddenError("비밀번호가 틀렸습니다.");
  }

  if (findStyle.password !== password)
    throw new ForbiddenError("비밀번호가 틀렸습니다");
  const deleteStyle = await prisma.style.delete({
    where: {
      id: styleId,
      password,
    },
  });
  return deleteStyle;
}

/**
 * 스타일 상세 조회
 * @param {BigInt} styleId
 */
export async function detailFindStyle(styleId) {
  const detailStyle = await prisma.style.findUnique({
    where: { id: BigInt(styleId) },

    include: {
      images: {
        orderBy: { order: "desc" },
      },
      items: true,
      tags: {
        include: {
          tag: true,
        },
      },
      curations: {
        include: {
          reply: true,
        },
      },
    },
  });

  if (!detailStyle) {
    throw new NotFoundError("존재하지 않는 스타일입니다.");
  }
  console.log(detailStyle);
  return Style.fromEntity(detailStyle);
}

/**
 * 스타일 이미지 등록
 * 처리 후 등록된 이미지의 경로를 반환함
 * @param {String} uploadFile - 업로드 이미지 경로
 * @returns {String} - 이미지 경로 반환
 */
export function createStyleImage(uploadFile) {
  try {
    if (!uploadFile || uploadFile.length === 0) {
      // 파일을 찾을 수 없을 때 처리
      return new NotFoundError("업로드된 이미지가 없습니다.");
    }
    const filePath = uploadFile.path.replace(/\\/g, "/");
    const imageUrl = `${HOST_NAME}/${filePath}`;
    return imageUrl;
  } catch (error) {
    throw new Error(error);
  }
}

function parseStyleItemKeys(items, styleId) {
  const itemKeys = Object.keys(items);
  const styleItemsData = itemKeys
    .filter((key) => {
      if (!items[key]) return false;
      if (isNaN(items[key].price)) return false;
      if (!items[key].name || !items[key].brand) return false;
      return true;
    })
    .map((key) => {
      return {
        style_id: styleId,
        item_name: items[key].name,
        brand_name: items[key].brand,
        price: items[key].price ?? 0,
        category: StyleCategory[key.toUpperCase()],
      };
    });
  return styleItemsData;
}

async function upsertTags(tr, tags, styleId) {
  await Promise.all(
    tags.map(async (tagName) => {
      const updatedTag = await tr.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      });
      await tr.styleTag.create({
        data: {
          style_id: styleId,
          tag_id: updatedTag.id,
        },
      });
    }),
  );
}
function parseStyleImageUrl(imageUrls, styleId) {
  const styleImageData = imageUrls.map((imageUrl, index) => {
    const lastIndex = imageUrl.lastIndexOf("/");
    const imageName = imageUrl.substring(lastIndex + 1);
    const imagePath = imageUrl.substring(0, lastIndex);
    return {
      style_id: styleId,
      name: imageName,
      path: imagePath,
      size: 50000, // 임시 값
      order: index + 1, // 순서 (1부터 시작)
    };
  });
  return styleImageData;
}
