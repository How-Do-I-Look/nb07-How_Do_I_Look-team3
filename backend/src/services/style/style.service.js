import { StyleCategory } from "../../../generated/prisma/index.js";
import { prisma } from "../../utils/prisma.js";

const HOST_NAME = process.env.DEV_HOST_NAME;

export async function createStyle(req, res, next) {
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
      }
    });

    res.status(200).json({ message: "성공", data: newStyle });
  } catch (error) {
    next(error);
  }
}

export async function updateStyle(req, res, next) {
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
    if (!password) {
      throw new Error("비밀번호 없음");
    }

    const existStyle = await prisma.style.findUnique({
      where: { id: styleId },
    });
    if (!existStyle) {
      return res
        .status(404)
        .json({ message: "수정하려는 스타일을 찾을 수 없음" });
    }
    if (existStyle.password !== password) {
      return res.status(403).json({ message: "비밀번호 불일치" });
    }
    const styleTransaction = await prisma.$transaction(async (tr) => {
      await tr.styleImage.deleteMany({ where: { style_id: styleId } });
      await tr.styleItem.deleteMany({ where: { style_id: styleId } });
      await tr.styleTag.deleteMany({ where: { style_id: styleId } });

      const updatedstyle = await tr.style.update({
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
      return updatedstyle;
    });
    res.status(200).json({ data: styleTransaction });
  } catch (error) {
    next(error);
  }
}
export async function deleteStyle(req, res, next) {
  try {
    const { styleId } = req.params;
    const { password } = req.body;

    if (!password) {
      throw new Error("잘못된 요청입니다");
    }

    const existStyle = await prisma.style.findUnique({
      where: { id: styleId },
    });
    if (!existStyle) {
      return res.status(404).json({ message: "존재하지 않습니다" });
    }
    if (existStyle.password !== password) {
      return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
    }
    const getStyles = await prisma.style.delete({
      where: {
        id: styleId,
        password,
      },
    });
    res.status(200).json({ message: "스타일 삭제 성공", data: getStyles });
  } catch (error) {
    next(error);
  }
}

export function createStyleImage(req, res, next) {
  try {
    const uploadFile = req.file;
    if (!uploadFile || uploadFile.length === 0) {
      // 파일을 찾을 수 없을 때 처리
      return res.status(400).json({ message: "업로드된 이미지가 없습니다." });
    }

    const filePath = uploadFile.path.replace(/\\/g, "/");
    const imageUrl = `${HOST_NAME}/${filePath}`;

    console.log(imageUrl);

    res.status(201).json({ imageUrl });
  } catch (error) {
    next(error);
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
