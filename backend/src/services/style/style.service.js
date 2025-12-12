import { StyleCategory } from "../../../generated/prisma/index.js";
import { Style } from "../../classes/style/style.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../errors/errorHandler.js";
import { prisma } from "../../utils/prisma.js";

const HOST_NAME = process.env.DEV_HOST_NAME;
export async function createStyle(author, title, description, password, items, tags, imageUrls) {
  try {


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
          where : {id:styleId},
          include : {
            images : {
              orderBy : {order : 'desc'},
            },
            items : true,
            tags : {
              include : {
                tag : true,
              }
            }
          }
        })
        return result;
      }
    });

    return Style.fromEntity(newStyle);
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateStyle(styleId, title, description, password, items, tags, imageUrls) {
  try {

    const existStyle = await prisma.style.findUnique({
      where: { id: styleId },
    });
    if (!existStyle) {
      return new NotFoundError('수정하려는 스타일이 없습니다.');
    }
    if (existStyle.password !== password) {
      return new ForbiddenError('비밀번호가 틀렸습니다.');
    }
    const newStyle = await prisma.$transaction(async (tr) => {
      await tr.styleImage.deleteMany({ where: { style_id: styleId } });
      await tr.styleItem.deleteMany({ where: { style_id: styleId } });
      await tr.styleTag.deleteMany({ where: { style_id: styleId } });

      const updatedstyle = await tr.style.update({
        where: { id: styleId, password },
        data: {
          title,
          description,
        }
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
          where : {id:styleId},
          include : {
            images : {
              orderBy : {order : 'desc'},
            },
            items : true,
            tags : {
              include : {
                tag : true,
              }
            }
          }
        })
        return result;
    });
    return Style.fromEntity(newStyle);
  } catch (error) {
    throw new Error(error);
  }
}
export async function deleteStyle(styleId, password) {
  try {

    const existStyle = await prisma.style.findUnique({
      where: { id: styleId },
    });
    if (!existStyle) {
      return new NotFoundError('삭제하려는 스타일이 없습니다.');
    }
    if (existStyle.password !== password) {
      return new ForbiddenError('비밀번호가 틀렸습니다.');
    }
    const findStyle = await prisma.style.findUnique({
        where : {
          id : styleId,
        }
    });
    if(!findStyle) throw new NotFoundError("존재하지않습니다.");
    if(findStyle.password !== password) throw new ForbiddenError("비밀번호가 틀렸습니다");
    const deleteStyle = await prisma.style.delete({
      where: {
        id: styleId,
        password,
      },
    });
    return deleteStyle;
  } catch (error) {
    throw new Error(error);
  }
}

export function createStyleImage(uploadFile) {
  try {

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
