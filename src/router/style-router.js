import { Style, StyleComponent, Type } from "../controllers/style.js";
import express from express;
import { prisma } from "@prisma/client";

const styleRouter = new Router();
// **스타일 등록**
// - 유저가 사진(여러장 가능)을 업로드하고 태그(최대 3개), 제목, 닉네임, 스타일 구성, 스타일 설명, 비밀번호를 입력하여 스타일을 등록합니다.
// - 스타일 구성의 종류에는 **상의, 하의, 아우터, 원피스, 신발, 가방, 패션잡화**가 있으며, 각 구성마다 의상명, 브랜드명, 가격을 입력할 수 있습니다.
async function createStyle(req, res) {
  try {
    const { photos, tags, title, nickname, styleComponents, description, password } = req.body;

    const newStyle = await prisma.style.create({
      data: {
        photos,
        tags,
        title,
        nickname,
        styleComponents: {
          create: styleComponents.map(component => ({
            type: component.type,
            clothingName: component.clothingName,
            brandName: component.brandName,
            price: component.price,
          })),
        },
        description,
        password,
      },
      include: {
        styleComponents: true,
      },
    });

    res.status(201).json(newStyle);
  } catch (error) {
    console.error("Error creating style:", error);
       if ( tags.length > 3 ) {
          return res.status(400).json({ error: "Maximum of 3 tags allowed" });
        }
    res.status(500).json({ error: "Internal server error" });
  }
}

styleRouter.post("/styles", createStyle); 


// **스타일 수정**
// - 비밀번호를 입력하여 스타일 등록 시 입력했던 비밀번호와 일치할 경우 스타일 수정이 가능합니다.
async function updateStyle(req, res) {
  try {
    const { id } = req.params;
    const { photos, tags, title, nickname, styleComponents, description, password } = req.body;

    const existingStyle = await prisma.style.findUnique({
      where: { id: Number(id) },
    });

    if (!existingStyle) {
      return res.status(404).json({ error: "Style not found" });
    }

    if (existingStyle.password !== password) {
      return res.status(403).json({ error: "Incorrect password" });
    }

    const updatedStyle = await prisma.style.update({
      where: { id: Number(id) },
      data: {
        photos,
        tags,
        title,
        nickname,
        styleComponents: {
          deleteMany: {},
          create: styleComponents.map(component => ({
            type: component.type,
            clothingName: component.clothingName,
            brandName: component.brandName,
            price: component.price,
          })),
        },
        description,
      },
      include: {
        styleComponents: true,
      },
    });

    res.status(200).json(updatedStyle);
  } catch (error) {
    console.error("Error updating style:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

styleRouter.put("/styles/:id", updateStyle);

// **스타일 삭제**
// - 비밀번호를 입력하여 스타일 등록 시 입력했던 비밀번호와 일치할 경우 스타일 삭제가 가능합니다.
async function deleteStyle(req, res) {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const existingStyle = await prisma.style.findUnique({
      where: { id: Number(id) },
    });

    if (!existingStyle) {
      return res.status(404).json({ error: "Style not found" });
    }

    if (existingStyle.password !== password) {
      return res.status(403).json({ error: "Incorrect password" });
    }

    await prisma.style.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Style deleted successfully" });
  } catch (error) {
    console.error("Error deleting style:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

styleRouter.delete("/styles/:id", deleteStyle);     

// **스타일 목록 조회**
// - 갤러리
//     - 등록된 스타일 목록을 조회할 수 있습니다.
//     - 각 스타일의 대표 이미지, 제목, 닉네임, 태그, 스타일 구성, 스타일 설명, 조회수, 큐레이팅 수가 표시됩니다.
//     - 갤러리 상단에 인기 태그가 표시됩니다. 해당 태그를 클릭하면 그 태그에 해당하는 스타일 목록이 표시됩니다.
//     - 페이지네이션이 가능합니다.
//     - 최신순, 조회순, 큐레이팅순(큐레이팅 많은 순)으로 정렬 가능합니다.
//     - 닉네임, 제목, 상세, 태그로 검색이 가능합니다.
async function getStyles(req, res) {
  try {
    const { page = 1, limit = 10, sortBy = "latest", search = "", tag = "" } = req.query;

    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    let orderBy;
    if (sortBy === "views") {
      orderBy = { views: "desc" };
    } else if (sortBy === "curations") {
      orderBy = { curations: "desc" };
    } else {
      orderBy = { createdAt: "desc" };
    }

    const where = {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { nickname: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { tags: { has: search } },
              ],
            }
          : {},
        tag ? { tags: { has: tag } } : {},
      ],
    };

    const styles = await prisma.style.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        styleComponents: true,
      },
    });

    const totalStyles = await prisma.style.count({ where });

    res.status(200).json({
      styles,
      totalPages: Math.ceil(totalStyles / take),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching styles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

styleRouter.get("/styles", getStyles);  

// - 랭킹
//     - 전체, 트렌디, 개성, 실용성, 가성비 기준으로 스타일 랭킹 목록을 조회할 수 있습니다.
//     - 각 스타일의 대표 이미지, 제목, 닉네임, 태그, 스타일 구성, 조회수, 큐레이팅수가 표시됩니다.
//     - 페이지네이션이 가능합니다.
styleRouter.get("/styles/ranking", getStyles);

// **스타일 상세 조회**
// - 갤러리, 랭킹에서 스타일을 클릭할 경우 스타일 상세 조회가 가능합니다.
// - 이미지(여러장 가능), 제목, 닉네임, 태그, 스타일 구성, 스타일 설명, 조회수, 큐레이팅수가 표시됩니다.
// - 해당 스타일의 큐레이팅 목록이 표시됩니다.
styleRouter.get("/styles/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const style = await prisma.style.findUnique({
      where: { id: Number(id) },
      include: {
        styleComponents: true,
        curations: true,
      },
    });

    if (!style) {
      return res.status(404).json({ error: "Style not found" });
    }

    // 조회수 증가
    await prisma.style.update({
      where: { id: Number(id) },
      data: { views: { increment: 1 } },
    });

    res.status(200).json(style);
  } catch (error) {
    console.error("Error fetching style details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});   


export default styleRouter;