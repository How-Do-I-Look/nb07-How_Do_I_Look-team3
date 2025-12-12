import { prisma } from "../../utils/prisma.js";

// ✨ 큐레이팅 생성
export async function createCuration(req, res) {
  try {
    const data = req.body;

    const created = await prisma.curation.create({
      data: {
        style_id: BigInt(data.style_id),
        author: data.author,
        content: data.content,
        password: data.password,
        trendy: data.trendy ?? 0,
        personality: data.personality ?? 0,
        practicality: data.practicality ?? 0,
        performance: data.performance ?? 0,
      },
    });
    if (created) {
      return res.status(200).json({ message: "생성이 완료되었습니다." });
    } else {
      return res.status(400).json({ message: "오류" });
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

// ✨ 스타일의 큐레이팅 목록 조회
export async function getCurations(req, res) {
  try {
    const styleId = 1;
    const list = await prisma.curation.findMany({
      where: { style_id: styleId },
      include: { reply: true },
      orderBy: { created_at: "desc" },
    });

    return res.json(list);
  } catch (err) {
    throw new Error(err.message);
  }
}

// ✨ 큐레이팅 상세 조회
export async function getCuration(req, res) {
  try {
    const id = 1;

    const result = await prisma.curation.findUnique({
      where: { id },
      include: {
        reply: true,
        style: true,
      },
    });

    return res.status(200).json(result);
  } catch (err) {
    throw new Error(err.message);
  }
}

// ✨ 큐레이팅 삭제
export async function deleteCuration(req, res) {
  try {
    const id = 1;
    const { password } = req.body;

    const found = await prisma.curation.findUnique({
      where: { id },
    });

    if (!found) return res.status(404).json({ message: "Curation Not Found" });

    if (found.password !== password)
      return res.status(403).json({ message: "Invalid Password" });

    const deleted = await prisma.curation.delete({
      where: { id },
    });

    return res.json(deleted);
  } catch (err) {
    throw new Error(err.message);
  }
}

// ✨ 큐레이팅 수정 (update)
export async function updateCuration(req, res) {
  try {
    const id = 1;
    const { password, content } = req.body;

    const found = await prisma.curation.findUnique({
      where: { id },
    });

    if (!found) return res.status(404).json({ message: "Curation Not Found" });

    if (found.password !== password)
      return res.status(403).json({ message: "Invalid Password" });

    const updated = await prisma.curation.update({
      where: { id },
      data: { content },
    });

    return res.json(updated);
  } catch (err) {
    throw new Error(err.message);
  }
}
